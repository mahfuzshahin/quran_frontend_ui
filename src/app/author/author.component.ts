import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {AuthorService} from "../service/configuration/author.service";
import {Author} from "../model/author";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {NgSelectModule} from "@ng-select/ng-select";
import {HttpClient} from "@angular/common/http";
import {NewsService} from "../service/configuration/news.service";
import {MediaService} from "../service/media.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    EditorComponent,
    NgSelectModule
  ],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css'
})
export class AuthorComponent implements OnInit{
  @ViewChild('myForm') form: NgForm | undefined;
  content = '';
  showMediaModal = false;
  mediaList: any[] = [];
  selectedUrl: string | null = null;
  editorInstance: any;
  imageDialogOpen = false;
  private tinyCallback: ((url: string, meta?: any) => void) | null = null;
  selectedFile: File | null = null;

  currentMediaTarget: 'editor' | 'feature' | null = null;
  selectedFeatureImage: string | null = null;
  selectedFeatureAttachmentId: number | null = null;

  author:any = new Author();
  authors:any=[];
  isAuthorView: boolean = false;
  isSaveButton:boolean = true;
  isUpdateButton:boolean = false;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authorService: AuthorService,
    private newsService: NewsService,
    private mediaService: MediaService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadMedia();
    this.getAuthor();
  }

  getAuthor(){
    this.authorService.getAuthor().subscribe((response:any)=>{
      this.authors = response.data;
    })
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

  confirmImage() {
    if (!this.selectedUrl) return;
    console.log(this.currentMediaTarget)
    // ✅ CASE 1: Modal opened from Feature Image field
    if (this.currentMediaTarget === 'feature') {
      this.selectedFeatureImage = this.selectedUrl;
      this.author.attachment_id = this.selectedFeatureAttachmentId;
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


  openFeatureImageModal() {
    this.currentMediaTarget = 'feature';
    this.showMediaModal = true;
  }
  removeFeatureImage(event: Event) {
    event.stopPropagation();
    this.selectedFeatureImage = null;
  }

  postAuthor() {
    const payload = {
      ...this.author,
      attachment_id: this.selectedFeatureAttachmentId,
    };

    this.authorService.postAuthor(payload).subscribe((response:any)=>{
      if(response.status){
        this.toastr.success(response.message);
        this.authors.push(response.data);
        this.author = new Author();
        this.form?.resetForm(this.author);
        this.isAuthorView = false;
      }
    })
  }

  editAuthor(value: any) {
    this.isAuthorView = true;
    this.isUpdateButton = false;
    this.isSaveButton = false;
    this.author= value;
    this.author.attachment_id = value.attachment?.id || null;
    this.selectedFeatureImage = value.profileImage || null;

  }

  deleteAuthor(value: any) {

  }

  addAuthorView() {
    this.isAuthorView = !this.isAuthorView;
  }

  cancel() {
    this.isAuthorView = false;
    this.author = new Author();
  }

  putAuthor() {
    const payload = {
      id: this.author.id,
      name: this.author.name,
      email: this.author.email,
      designation: this.author.designation,
      attachment_id: this.selectedFeatureAttachmentId || this.author.attachment_id,
    };
    this.authorService.putAuthor(payload, this.author.id).subscribe((response:any)=>{
      if(response.status){
        let indexToUpdate = this.authors.findIndex((item: Author) => item.id === this.author.id);
        this.authors[indexToUpdate] = response.data;
        this.author = new Author();
        this.form?.resetForm(this.author);
        this.isUpdateButton = false;
        this.isSaveButton = true;
        this.isAuthorView = false;
      }
    })
  }
}
