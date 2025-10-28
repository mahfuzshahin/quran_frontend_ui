import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CategoryService} from "../service/configuration/category.service";
import {Category} from "../model/category";
import {FormsModule, NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  @ViewChild('myForm') form: NgForm | undefined;
  categories:any = [];
  category:any = new Category();
  modalOpen = false;
  formSubmitted = false;
  loading = false;
  isSaveButton:boolean = true;
  isUpdateButton:boolean = false;
  constructor(private categoryService: CategoryService, private toastr: ToastrService) {
  }
  ngOnInit(){
    this.getCategory();
  }
  openModal() { this.modalOpen = true; }
  closeModal() {
    this.modalOpen = false;
    this.category = new Category();
    this.formSubmitted = false;
    this.isSaveButton = true;
    this.isUpdateButton = false;
  }
  getCategory(){
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.categories = response.data;
    })
  }

  postCategory() {
    this.formSubmitted = true;
    if (!this.form?.valid) {
      this.toastr.error('Please fill out the form correctly before submitting.');
      return;
    }
    this.loading = true;
    this.categoryService.postCategory(this.category).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response && response.data) {
          this.toastr.success('Category added successfully!');
          this.categories.push(response.data);
          this.category = new Category();
          this.formSubmitted = false;
          this.modalOpen = false;
        } else {
          this.toastr.warning(response.message || 'Something went wrong.');
        }
      },
      error: (err:any) => {
        this.loading = false;
        this.toastr.error(err?.error?.message || 'Failed to add category.');
      }
    });
  }

  editCategory(category: any) {
    this.category = category;
    this.modalOpen = true;
    this.isUpdateButton = true;
    this.isSaveButton = false;
  }
  puttCategory() {
    this.formSubmitted = true;
    if (!this.form?.valid) {
      this.toastr.error('Please fill out the form correctly before submitting.');
      return;
    }
    this.loading = true;
    this.categoryService.putCategory(this.category, this.category.id).subscribe((response:any)=>{
      this.loading = false;
      if (response.status){
        this.toastr.success(response.message);
        let indexToUpdate = this.categories.findIndex((item: Category) => item.id === this.category.id);
        this.categories[indexToUpdate] = response.data;
        this.category = new Category();
        this.form?.resetForm(this.category);
        this.isUpdateButton = false;
        this.isSaveButton = true;
        this.modalOpen = false;
      }
    })
  }

  deleteCategory(category: any) {
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
        this.categoryService.deleteCategory(category.id).subscribe((response:any) => {
          if(response.status){
            this.categories = this.categories.filter((item: any)  => item !== category);
            this.toastr.success(response.message);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.warning('Cancel')
      }
    });
  }
}
