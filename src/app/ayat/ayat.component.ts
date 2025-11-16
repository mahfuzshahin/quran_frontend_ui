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
  keyword = new Keyword();
  // keyword: any = {};
  selectedSurahId: number | null = null;
  selectedTagId:any;

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

  saveKeyword() {
    // console.log(this.keyword.tag_id)
    // if (!this.selectedAyat || !this.keyword.tag_id) return;
    //
    // const payload = {
    //   ayat_id: this.selectedAyat.id,
    //   tag_id: this.keyword.tag_id
    // };
    this.keyword.ayat_id= this.selectedAyat.id;
    this.keywordService.postKeyword(this.keyword).subscribe((response: any) => {
      if (response.status) {
        this.selectedAyat.keywords = this.selectedAyat.keywords || [];
        this.selectedAyat.keywords.push(response.data);

        this.toastr.success(response.message);
        this.showKeywordModal = false;
        this.keyword = new Keyword(); // reset
      }
    });
  }

}
