import {Component, OnInit} from '@angular/core';
import {SurahService} from "../service/surah.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Ayat} from "../model/ayat";
import {AyatService} from "../service/ayat.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-ayat',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './ayat.component.html',
  styleUrl: './ayat.component.css'
})
export class AyatComponent implements OnInit{
  surahs:any=[];
  ayats: any[] = [];
  ayat:any = new Ayat();
  selectedSurahId: number | null = null;

  showKeywordModal: boolean = false;
  selectedAyat: any = null;
  keyword: string = '';
  constructor(private surahService: SurahService, private ayatService: AyatService, private toastr: ToastrService) {
  }
  ngOnInit() {
    this.getSurah()
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

  openKeywordModal(ayat: any) {
    this.selectedAyat = ayat;
    this.keyword = '';
    this.showKeywordModal = true;
  }

  closeKeywordModal() {
    this.showKeywordModal = false;
  }

  saveKeyword() {
    // if (!this.keyword.trim()) {
    //   alert('Please enter a keyword.');
    //   return;
    // }
    //
    // const payload = {
    //   ayat_id: this.selectedAyat.id,
    //   keyword: this.keyword,
    // };
    //
    // this.ayatService.addKeyword(payload).subscribe({
    //   next: (res: any) => {
    //     alert('Keyword added successfully!');
    //     this.showKeywordModal = false;
    //   },
    //   error: () => {
    //     alert('Failed to add keyword.');
    //   },
    // });
  }
}
