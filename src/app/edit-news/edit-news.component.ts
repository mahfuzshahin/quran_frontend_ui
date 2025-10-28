import {Component, NgZone, OnInit} from '@angular/core';
import {News} from "../model/news";
import {NewsService} from "../service/configuration/news.service";
import {ActivatedRoute} from "@angular/router";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {CategoryService} from "../service/configuration/category.service";
import {TagService} from "../service/configuration/tag.service";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Media} from "../model/media";
import {MediaService} from "../service/media.service";
import {NewsGalleryComponent} from "../news-gallery/news-gallery.component";
import {NewsVideoComponent} from "../news-video/news-video.component";
import {AuthorService} from "../service/configuration/author.service";

@Component({
  selector: 'app-edit-news',
  standalone: true,
  imports: [
    JsonPipe,
    EditorComponent,
    FormsModule,
    NgForOf,
    NgIf,
    NgSelectModule,
    ReactiveFormsModule,
    NewsGalleryComponent,
    NewsVideoComponent
  ],
  templateUrl: './edit-news.component.html',
  styleUrl: './edit-news.component.css'
})
export class EditNewsComponent implements OnInit{
  news:any = new News();
  editorInstance: any;
  categories:any=[];
  tags:any=[];
  authors:any=[];
  showMediaModal:boolean = false;
  private tinyCallback: ((url: string, meta?: any) => void) | null = null;
  currentMediaTarget: 'editor' | 'feature' | null = null;
  selectedFeatureImage: string | null = null;
  selectedFeatureAttachmentId: number | null = null;
  mediaList: any[] = [];
  selectedUrl: string | null = null;
  constructor(private newsService: NewsService, private mediaService: MediaService,
              private categoryService: CategoryService, private tagService: TagService,
              private authorService: AuthorService,
              private route: ActivatedRoute, private ngZone: NgZone, private http: HttpClient, private toastr: ToastrService) {
  }
  ngOnInit() {
    this.viewNews();
    this.loadMedia();
    this.getCategory();
    this.getTag();
    this.getAuthor();
  }
  getAuthor(){
    this.authorService.getAuthor().subscribe((response:any)=>{
      this.authors = response.data;
    })
  }
  viewNews(){
    this.route.params.subscribe((params)=>{
      const newsId = +params['id'];
      this.newsService.getViewNews(newsId).subscribe((response:any)=>{
        this.news = response.data;
        this.news.categoryIds = response.data.categories.map((cat: any) => cat.id) || [];
        this.news.tagIds = response.data.tags.map((tag: any) => tag.id) || [];
        this.news.attachment_id = response.data.attachment.id;
        this.news.author_id = response.data?.author?.id;
        // this.selectedFeatureImage = `http://localhost:3000/uploads/${response.data.attachment.filePath}`;
        if (response.data.attachment) {
          this.news.attachment_id = response.data.attachment.id;
          this.selectedFeatureImage = `http://localhost:3000/uploads/${response.data.attachment.filePath}`;
        } else {
          this.news.attachment_id = null;
          this.selectedFeatureImage = null;
        }
      });
    })
  }
  onEditorInit(event: any) {
    this.editorInstance = event.editor;
  }
  getCategory(){
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.categories = response.data;
    })
  }
  getTag(){
    this.tagService.getTag().subscribe((response:any)=>{
      this.tags = response.data;
    })
  }
  filePickerCallback(callback: (url: string, meta?: any) => void, value: string, meta: any) {
    if (meta.filetype === 'image') {
      this.ngZone.run(() => {
        this.showMediaModal = true;
        this.tinyCallback = callback;
        this.currentMediaTarget = 'editor';
      });
    }
  }
  openFeatureImageModal() {
    this.currentMediaTarget = 'feature';
    this.showMediaModal = true;
  }
  removeFeatureImage(event: Event) {
    event.stopPropagation();
    this.selectedFeatureImage = null;
  }

  putNews() {
    const payload = {
      title: this.news.title,
      content: this.news.content,
      status: this.news.status,
      publishAt: new Date().toISOString(),
      categoryIds: this.news.categoryIds || [],
      tagIds: this.news.tagIds || [],
      attachment_id: this.selectedFeatureAttachmentId || this.news.attachment_id,
      author_id: this.news.author_id,
      isFeatured: this.news.isFeatured,
      isBreaking: this.news.isBreaking,
    };
    this.newsService.putNews(payload, this.news.id).subscribe((response: any) => {
      if (response.status) {
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post<any>('http://localhost:3000/api/media/upload', formData)
      .subscribe({
        next: () => {
          this.toastr.success('Image uploaded!');
          this.loadMedia();
        },
        error: () => this.toastr.error('Upload failed'),
      });
  }
  loadMedia() {
    this.mediaService.getAll().subscribe({
      next: (res: any[]) => {
        this.mediaList = res.map((m: any) => ({
          ...m,
          fileUrl: `http://localhost:3000/uploads/${m.filePath}`,
        }));
      },
      error: () => this.toastr.error('Failed to load media'),
    });
  }
  selectImage(url: string, media:any) {
    this.selectedUrl = url;
    console.log('Selected URL:', this.selectedUrl);
    this.selectedFeatureAttachmentId = media;
  }
  closeModal() {
    this.showMediaModal = false;
    this.selectedUrl = null;
    this.tinyCallback = null;
    this.currentMediaTarget = null;
  }
  confirmImage() {
    console.log(this.currentMediaTarget)
    if (!this.selectedUrl) return;
    if (this.currentMediaTarget === 'feature') {
      this.selectedFeatureImage = this.selectedUrl;
      this.news.attachment_id = this.selectedFeatureAttachmentId;
      this.toastr.success('Feature image selected!');
      this.closeModal();
      return;
    }
    if (this.currentMediaTarget === 'editor' && this.editorInstance) {
      const editor = this.editorInstance;
      editor.insertContent(
        `<img src="${this.selectedUrl}" alt="Selected image" style="max-width:100%;height:auto;" />`
      );
      const imgs = editor.dom.select('img');
      const lastImg = imgs[imgs.length - 1];
      editor.selection.select(lastImg);
      editor.execCommand('mceImage');
      this.toastr.success('Image inserted into editor!');
      this.closeModal();
    }
  }
}
