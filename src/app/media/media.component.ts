import {Component, OnInit} from '@angular/core';
import {MediaService} from "../service/media.service";
import {ToastrService} from "ngx-toastr";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media.component.html',
  styleUrl: './media.component.css'
})
export class MediaComponent implements OnInit{
  mediaList: any[] = [];
  modalOpen = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  constructor(private mediaService: MediaService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadMedia();
  }

  openModal() { this.modalOpen = true; }
  closeModal() { this.modalOpen = false; this.selectedFile = null; }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0]; // TypeScript knows this is a File
      this.selectedFile = file;
      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file); // use local variable
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.toastr.warning('Please select a file first');
      return; // exit if no file
    }

    // TypeScript now knows selectedFile is not null
    this.mediaService.upload(this.selectedFile).subscribe({
      next: (res) => {
        this.toastr.success('File uploaded successfully');
        this.closeModal();
        this.loadMedia();
        this.selectedFile = null; // reset selection
        this.previewUrl = null;   // reset preview
      },
      error: () => this.toastr.error('Upload failed')
    });
  }
  loadMedia() {
    this.mediaService.getAll().subscribe({
      next: (res: any[]) => {
        this.mediaList = res.map((m: any) => ({
          ...m,
          fileUrl: `http://localhost:3000/uploads/${m.filePath}`
        }));
      },
      error: () => this.toastr.error('Failed to load media')
    });
  }
  deleteMedia(id: number) {
    // Call backend delete API
    // this.mediaService.delete(id).subscribe(() => {
    //   this.toastr.success('Image deleted');
    //   this.loadMedia();
    // });
  }
}
