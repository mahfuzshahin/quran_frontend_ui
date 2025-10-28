import {Component, Input, ViewChild} from '@angular/core';
import {News} from "../model/news";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {VideoService} from "../service/configuration/video.service";
import {NgForOf, NgIf} from "@angular/common";
import {Video} from "../model/video";

@Component({
  selector: 'app-news-video',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './news-video.component.html',
  styleUrl: './news-video.component.css'
})
export class NewsVideoComponent {
  @Input() news:any=new News();
  @ViewChild('myForm') form: NgForm | undefined;
  videos:any = [];
  video:any = new Video();
  modalOpen = false;
  formSubmitted = false;
  loading = false;
  isSaveButton:boolean = true;
  isUpdateButton:boolean = false;
  constructor(private videoService: VideoService, private toastr: ToastrService) {
  }
  ngOnInit(){
    // this.getVideo();
  }
  openModal() { this.modalOpen = true; }
  closeModal() {
    this.modalOpen = false;
    this.video = new Video();
    this.formSubmitted = false;
    this.isSaveButton = true;
    this.isUpdateButton = false;
  }

  postVideo() {
    this.formSubmitted = true;
    if (!this.form?.valid) {
      this.toastr.error('Please fill out the form correctly before submitting.');
      return;
    }
    this.loading = true;
    this.video.newsId = this.news.id;
    this.videoService.postVideo(this.video).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.data) {
          this.toastr.success('Video added successfully!');
          this.news.videos.push(response.data);
          this.video = new Video();
          this.formSubmitted = false;
          this.modalOpen = false;
        } else {
          this.toastr.warning(response.message || 'Something went wrong.');
        }
      },
      error: (err:any) => {
        this.loading = false;
        this.toastr.error(err?.error?.message || 'Failed to add video.');
      }
    });
  }

  editVideo(video: any) {
    this.video = video;
    this.modalOpen = true;
    this.isUpdateButton = true;
    this.isSaveButton = false;
  }
  puttVideo() {
    this.formSubmitted = true;
    if (!this.form?.valid) {
      this.toastr.error('Please fill out the form correctly before submitting.');
      return;
    }
    this.loading = true;
    this.videoService.putVideo(this.video, this.video.id).subscribe((response:any)=>{
      this.loading = false;
      if (response.status){
        this.toastr.success(response.message);
        let indexToUpdate = this.videos.findIndex((item: Video) => item.id === this.video.id);
        this.videos[indexToUpdate] = response.data;
        this.video = new Video();
        this.form?.resetForm(this.video);
        this.isUpdateButton = false;
        this.isSaveButton = true;
        this.modalOpen = false;
      }
    })
  }

  deleteVideo(video: any) {
    Swal.fire({
      title: '<span class="text-xl font-semibold text-gray-900 dark:text-white">Are you sure?</span>',
      html: '<p class="text-gray-700 dark:text-gray-300">This action cannot be undone.</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<span class="text-white">Yes, delete it!</span>',
      cancelButtonText: '<span class="text-gray-700">Cancel</span>',
      customClass: {
        popup: 'bg-white dark:bg-gray-800 shadow-lg',
        confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 text-white font-medium px-5 py-2.5 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 text-gray-800 font-medium px-5 py-2.5 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-500',
      },
      reverseButtons: true,
    }).then((result: any) => {
      if (result.value) {
        this.videoService.deleteVideo(video.id).subscribe((response:any) => {
          if(response.status){
            this.videos = this.videos.filter((item: any)  => item !== video);
            this.toastr.success(response.message);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.warning('Cancel')
      }
    });
  }
}
