import {Component, OnInit} from '@angular/core';
import {SurahService} from "../service/surah.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Ayat} from "../model/ayat";
import {AyatService} from "../service/ayat.service";
import {ToastrService} from "ngx-toastr";
import {TagService} from "../service/tag.service";
import {NgSelectModule} from "@ng-select/ng-select";
import {KeywordService} from "../service/keyword.service";
import {Keyword} from "../model/keyword";
import {Tag} from "../model/tag";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ayat',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    JsonPipe,
    NgSelectModule
  ],
  templateUrl: './ayat.component.html',
  styleUrl: './ayat.component.css'
})
export class AyatComponent implements OnInit{
  surahs:any=[];
  ayats: any[] = [];
  tags: any[] = [];
  ayat:any = new Ayat();
  keyword:any = new Keyword();
  // keyword: any = {};
  selectedSurahId: number | null = null;
  selectedTagId:any;
  tag:any = new Tag();

  showKeywordModal: boolean = false;
  selectedAyat: any = null;
  constructor(private surahService: SurahService, private tagService: TagService,
              private keywordService: KeywordService,
              private ayatService: AyatService, private toastr: ToastrService) {
  }
  ngOnInit() {
    this.getSurah();
    this.getTag();
  }

  getSurah(){
    this.surahService.getSurah().subscribe((response:any)=>{
      this.surahs = response.data;
    })
  }
  getAyat(){
    if (!this.selectedSurahId) return;
    this.ayatService.getAyatBySurah(this.selectedSurahId).subscribe({
      next: (response: any) => {
        this.ayats = response.data || [];
      },
      error: () => {
        this.toastr.error('Failed to load ayats');
      }
    });
  }
  getTag(){
    this.tagService.getTag().subscribe((response:any)=>{
      this.tags = response.data;
      this.tags.unshift({id:0,english_name: 'Other',
        bengali_name: 'অন্যান্য'})
    })
  }

  openKeywordModal(ayat: any) {
    this.keyword = new Keyword();
    this.selectedAyat = ayat;
    this.showKeywordModal = true;
  }

  closeKeywordModal() {
    this.showKeywordModal = false;
  }

  saveKeywordTest() {
    this.keyword.ayat_id = this.selectedAyat.id;

    this.keywordService.postKeyword(this.keyword).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.selectedAyat.keywords = this.selectedAyat.keywords || [];
          this.selectedAyat.keywords.push(response.data);

          this.toastr.success(response.message);
          this.showKeywordModal = false;
          this.keyword = new Keyword(); // reset
        }
      },
      error: (err) => {
        // Laravel validation error
        if (err.status === 422) {
          const msg =
            err.error?.errors?.tag_id?.[0] ||
            err.error?.message ||
            "Validation error";

          this.toastr.error(msg);
        } else {
          this.toastr.error("Something went wrong");
        }
      }
    });
  }

  saveKeyword() {
    this.keyword.ayat_id = this.selectedAyat.id;

    // If "Other" is selected, include new tag fields
    let payload: any;
    if (this.keyword.tag_id === 0) {
      payload = {
        ayat_id: this.keyword.ayat_id,
        english_name: this.tag.english_name,
        bengali_name: this.tag.bengali_name
      };
    } else {
      payload = { ...this.keyword }; // existing tag
    }

    this.keywordService.postKeyword(payload).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.selectedAyat.keywords = this.selectedAyat.keywords || [];
          this.selectedAyat.keywords.push(response.data);

          this.toastr.success(response.message);
          this.showKeywordModal = false;

          // Reset fields
          this.keyword = { tag_id: null, ayat_id: null };
          this.tag = { english_name: '', bengali_name: '' };
        }
      },
      error: (err) => {
        if (err.status === 422) {
          const msg =
            err.error?.errors?.tag_id?.[0] ||
            err.error?.message ||
            "Validation error";

          this.toastr.error(msg);
        } else {
          this.toastr.error("Something went wrong");
        }
      }
    });
  }


  deleteKeyword(k: any, ayat: any) {
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
      if (result.isConfirmed) {
        this.keywordService.deleteKeyword(k.id).subscribe((response: any) => {
          if (response.status) {
            ayat.keywords = ayat.keywords.filter((item: any) => item.id !== k.id);
            this.toastr.success(response.message);
          } else {
            this.toastr.error(response.message || 'Failed to delete keyword');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.toastr.warning('Delete cancelled');
      }
    });
  }
}
