import {Component, OnInit} from '@angular/core';
import {NewsService} from "../service/configuration/news.service";
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit{
  news_lists:any=[];
  constructor(private newsService: NewsService, private router: Router) {
  }
  ngOnInit() {
    this.getNews();
  }
  getNews(){
    this.newsService.getNews().subscribe((response:any)=>{
      this.news_lists = response.data;
    })
  }

  viewNews(news: any) {
    this.router.navigate(['news-view', news.id])
  }

  editNews(news: any) {
    this.router.navigate(['edit-news', news.id])
  }

  deleteNews(id:any) {

  }
}
