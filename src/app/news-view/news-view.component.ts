import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NewsService} from "../service/configuration/news.service";
import {ActivatedRoute} from "@angular/router";
import {News} from "../model/news";
import {CommonModule} from "@angular/common";
import {NewsGalleryComponent} from "../news-gallery/news-gallery.component";

@Component({
  selector: 'app-news-view',
  standalone: true,
  imports: [CommonModule, NewsGalleryComponent],
  templateUrl: './news-view.component.html',
  styleUrl: './news-view.component.css'
})
export class NewsViewComponent implements OnInit{
  news:any = new News();
  @ViewChild('galleryContainer') galleryContainer!: ElementRef<HTMLDivElement>;
  slideWidth = 280;
  currentIndex = 0;
  constructor(private newsService: NewsService, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.viewNews();
  }
  viewNews(){
    this.route.params.subscribe((params)=>{
      const newsId = +params['id'];
      this.newsService.getViewNews(newsId).subscribe((response:any)=>{
        this.news = response.data;
      });
    })
  }
  scrollLeft() {
    this.galleryContainer.nativeElement.scrollBy({ left: -this.slideWidth, behavior: 'smooth' });
  }

  scrollRight() {
    this.galleryContainer.nativeElement.scrollBy({ left: this.slideWidth, behavior: 'smooth' });
  }

  prev() {
    this.currentIndex =
      this.currentIndex === 0 ? this.news.galleries.length - 1 : this.currentIndex - 1;
  }

  next() {
    this.currentIndex =
      this.currentIndex === this.news.galleries.length - 1 ? 0 : this.currentIndex + 1;
  }
}
