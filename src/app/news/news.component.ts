import {Component, NgZone, OnInit} from '@angular/core';
import {EditorComponent} from "@tinymce/tinymce-angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {MediaService} from "../service/media.service";
import {ToastrService} from "ngx-toastr";
import {News} from "../model/news";
import {CategoryService} from "../service/configuration/category.service";
import {NewsService} from "../service/configuration/news.service";
import {NgSelectModule} from "@ng-select/ng-select";
import {TagService} from "../service/configuration/tag.service";
import {Router} from "@angular/router";
import {AuthorService} from "../service/configuration/author.service";

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    EditorComponent,
    FormsModule,
    ReactiveFormsModule, CommonModule, NgSelectModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit{
  content = '';
  showMediaModal = false;
  mediaList: any[] = [];
  selectedUrl: string | null = null;
  editorInstance: any;
  imageDialogOpen = false;
  private tinyCallback: ((url: string, meta?: any) => void) | null = null;
  news:any = new News();
  categories:any=[];
  tags:any=[];
  authors:any=[];
  selectedFile: File | null = null;

  currentMediaTarget: 'editor' | 'feature' | null = null;
  selectedFeatureImage: string | null = null;
  selectedFeatureAttachmentId: number | null = null;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private newsService: NewsService, private authorService: AuthorService,
    private mediaService: MediaService, private categoryService: CategoryService,
    private router: Router,
    private tagService: TagService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
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


  onFileSelectedFeatureImage(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.toastr.warning('Please select a file first');
      return;
    }

    this.selectedFile = input.files[0]; // ✅ set the selected file

    // Optionally, preview the image before upload
    // const reader = new FileReader();
    // reader.onload = () => this.previewUrl = reader.result as string;
    // reader.readAsDataURL(this.selectedFile);

    this.mediaService.upload(this.selectedFile).subscribe({
      next: (res) => {
        this.toastr.success('File uploaded successfully');
        this.news.attachment_id = res.media?.id;
      },
      error: () => this.toastr.error('Upload failed')
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

  // 🔹 TinyMCE "Browse" button handler
  filePickerCallback(callback: (url: string, meta?: any) => void, value: string, meta: any) {
    if (meta.filetype === 'image') {
      this.ngZone.run(() => {
        this.showMediaModal = true;
        this.tinyCallback = callback;
        this.currentMediaTarget = 'editor';
      });
    }
  }

  selectImage(url: string, media:any) {
    this.selectedUrl = url;
    this.selectedFeatureAttachmentId = media;
  }

  onEditorInit(event: any) {
    this.editorInstance = event.editor;
  }
  // 🔹 “Insert” button
  confirmImageT2() {
    if (this.selectedUrl && this.editorInstance) {
      const editor = this.editorInstance;
      editor.insertContent(
        `<img src="${this.selectedUrl}" alt="Selected image" style="max-width:100%;height:auto;" />`
      );
      const imgs = editor.dom.select('img');
      const lastImg = imgs[imgs.length - 1];
      editor.selection.select(lastImg);
      editor.execCommand('mceImage');
      this.toastr.success('Image inserted!');
      this.closeModal();
    }
  }

  confirmImage() {
    if (!this.selectedUrl) return;
    console.log(this.currentMediaTarget)
    // ✅ CASE 1: Modal opened from Feature Image field
    if (this.currentMediaTarget === 'feature') {
      this.selectedFeatureImage = this.selectedUrl;
      this.news.attachment_id = this.selectedFeatureAttachmentId;
      this.toastr.success('Feature image selected!');
      this.closeModal();
      return;
    }

    // ✅ CASE 2: Modal opened from TinyMCE editor
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

  confirmImageT() {
    if (this.selectedUrl && this.editorInstance) {
      this.ngZone.run(() => {
        // Insert image as TinyMCE object so resizing works
        this.editorInstance.insertContent(
          `<img src="${this.selectedUrl}" alt="Selected image" class="mce-object" style="max-width:100%;height:auto;" />`
        );

        this.toastr.success('Image inserted!');
        this.closeModal();
      });
    }
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

  closeModal() {
    this.showMediaModal = false;
    this.selectedUrl = null;
    this.tinyCallback = null;
    this.currentMediaTarget = null;
  }

  postNews() {
    console.log(this.selectedFeatureAttachmentId)
    const payload = {
      ...this.news,
      attachment_id: this.selectedFeatureAttachmentId,
      categoryIds: this.news.categoryIds || [],
      tagIds: this.news.tagIds || [],
      status: 'draft',
    };
    this.newsService.postNews(payload).subscribe((response:any)=>{
      if(response.status){
        this.toastr.success(response.message);
        this.router.navigate(['edit-news', response.data.id])
      }
    })
  }

  openFeatureImageModal() {
    this.currentMediaTarget = 'feature';
    this.showMediaModal = true;
  }
  removeFeatureImage(event: Event) {
    event.stopPropagation();
    this.selectedFeatureImage = null;
  }
}
