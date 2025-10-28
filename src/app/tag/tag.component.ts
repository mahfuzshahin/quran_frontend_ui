import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {Tag} from "../model/tag";
import {TagService} from "../service/configuration/tag.service";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent implements OnInit{
  @ViewChild('myForm') form: NgForm | undefined;
  tags:any = [];
  tag:any = new Tag();
  modalOpen = false;
  formSubmitted = false;
  loading = false;
  isSaveButton:boolean = true;
  isUpdateButton:boolean = false;
  constructor(private tagService: TagService, private toastr: ToastrService) {
  }
  ngOnInit(){
    this.getTag();
  }
  openModal() { this.modalOpen = true; }
  closeModal() {
    this.modalOpen = false;
    this.tag = new Tag();
    this.formSubmitted = false;
    this.isSaveButton = true;
    this.isUpdateButton = false;
  }
  getTag(){
    this.tagService.getTag().subscribe((response:any)=>{
      this.tags = response.data;
    })
  }

  postTag() {
    this.formSubmitted = true;
    if (!this.form?.valid) {
      this.toastr.error('Please fill out the form correctly before submitting.');
      return;
    }
    this.loading = true;
    this.tagService.postTag(this.tag).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response && response.data) {
          this.toastr.success('Tag added successfully!');
          this.tags.push(response.data);
          this.tag = new Tag();
          this.formSubmitted = false;
          this.modalOpen = false;
        } else {
          this.toastr.warning(response.message || 'Something went wrong.');
        }
      },
      error: (err:any) => {
        this.loading = false;
        this.toastr.error(err?.error?.message || 'Failed to add tag.');
      }
    });
  }

  editTag(tag: any) {
    this.tag = tag;
    this.modalOpen = true;
    this.isUpdateButton = true;
    this.isSaveButton = false;
  }
  puttTag() {
    this.formSubmitted = true;
    if (!this.form?.valid) {
      this.toastr.error('Please fill out the form correctly before submitting.');
      return;
    }
    this.loading = true;
    this.tagService.putTag(this.tag, this.tag.id).subscribe((response:any)=>{
      this.loading = false;
      if (response.status){
        this.toastr.success(response.message);
        let indexToUpdate = this.tags.findIndex((item: Tag) => item.id === this.tag.id);
        this.tags[indexToUpdate] = response.data;
        this.tag = new Tag();
        this.form?.resetForm(this.tag);
        this.isUpdateButton = false;
        this.isSaveButton = true;
        this.modalOpen = false;
      }
    })
  }

  deleteTag(tag: any) {
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
        this.tagService.deleteTag(tag.id).subscribe((response:any) => {
          if(response.status){
            this.tags = this.tags.filter((item: any)  => item !== tag);
            this.toastr.success(response.message);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.warning('Cancel')
      }
    });
  }
}
