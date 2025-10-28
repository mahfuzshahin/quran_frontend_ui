import {Component, OnInit, Input} from '@angular/core';
import {News} from "../model/news";
import {JsonPipe, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {MediaService} from "../service/media.service";
import {ToastrService} from "ngx-toastr";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Gallery} from "../model/gallery";
import {HttpClient} from "@angular/common/http";
import {GalleryService} from "../service/gallery.service";

@Component({
  selector: 'app-news-gallery',
  standalone: true,
  imports: [
    JsonPipe,
    NgForOf,
    NgIf,
    SlicePipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './news-gallery.component.html',
  styleUrl: './news-gallery.component.css'
})
export class NewsGalleryComponent implements OnInit{
  @Input() news:any=new News();
  mediaList: any[] = [];
  modalOpen = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  gallery:any = new Gallery();
  selectedFeatureImage: string | null = null;
  currentMediaTarget: 'editor' | 'feature' | null = null;
  selectedFeatureAttachmentId: number | null = null;
  showMediaModal:boolean = false;
  selectedUrl: string | null = null;
  openGallery:boolean = false;
  constructor(private mediaService: MediaService, private galleryService: GalleryService,
              private toastr: ToastrService, private http: HttpClient) {}
  ngOnInit() {
    this.loadMedia();
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
  openFeatureImageModal() {
    this.currentMediaTarget = 'feature';
    this.showMediaModal = true;
  }

  removeFeatureImage(event: Event) {
    event.stopPropagation();
    this.selectedFeatureImage = null;
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
    this.currentMediaTarget = null;
  }
  selectImage(url: string, media:any) {
    this.selectedUrl = url;
    this.selectedFeatureAttachmentId = media;
  }
  confirmImage() {
    if (!this.selectedUrl) return;
    console.log(this.currentMediaTarget)
    // ✅ CASE 1: Modal opened from Feature Image field
    if (this.currentMediaTarget === 'feature') {
      this.selectedFeatureImage = this.selectedUrl;
      this.gallery.attachmentId = this.selectedFeatureAttachmentId;
      this.toastr.success('Feature image selected!');
      this.closeModal();
      return;
    }
  }


  postNewsGallery() {
    this.gallery.newsId = this.news.id;
    this.galleryService.postGallery(this.gallery).subscribe((response:any)=>{
      if(response.status){
        this.news.galleries.push(response.data);
        this.gallery = new Gallery();
        this.selectedFeatureImage = null;
        this.toastr.success(response.message);
      }
    })
  }

  openAddGalleryModal() {
    this.openGallery = !this.openGallery;
  }

  cancel() {
    this.gallery = new Gallery();
    this.selectedFeatureImage = null;
    this.openGallery = false;
  }
}
