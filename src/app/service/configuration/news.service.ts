import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {News} from "../../model/news";
import {AuthService} from "../auth.service";
import {environment} from "../../../environment/environment";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private httpClient: HttpClient, private authService: AuthService, private toastr: ToastrService) { }
  getNews() {
    return this.httpClient.get<any>('http://localhost:3000/api/news' ).pipe(
      catchError((error: any): Observable<any> => {
        console.log(error)
        if (error.status === 404) {
          console.log(error.error.message || 'No employees found.');
        } else {
          console.log(error.error.message || 'An error occurred while fetching employees.');
        }
        return of([]);
      })
    );
  }
  getViewNews(id:any){
    return this.httpClient.get(environment.api_url +'/news/find?id='+
      id).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of(error.error);
    }));
  }

  postNews(news: News){
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null);
    }
    const body=JSON.stringify(news);
    return this.httpClient.post(environment.api_url +'/news', body,{headers}).pipe(catchError((error:any, caught:Observable<any>):Observable<any> =>{
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of()
    }))
  }

  putNews(news: {
    categoryIds: any;
    tagIds: any;
    publishAt: any;
    attachment_id: number | null;
    title: any;
    content: any;
    status: any
  }, id: any){
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null);
    }
    const body = JSON.stringify(news);
    return this.httpClient.put<any>(`${environment.api_url}/news/${id}`,body,{headers}).pipe(catchError((error:any, caught:Observable<any>):Observable<any> =>{
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of();
    }))
  }
  deleteNews(id: number) {
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null); // return observable to avoid TS error
    }

    return this.httpClient.delete(`${environment.api_url}/news/${id}`, { headers }).pipe(
      catchError((error: any) => {
        console.log(error)
        if (error.status === 404) {
          this.toastr.error('News not found');
        } else if (error.status === 401) {
          this.toastr.error('Unauthorized. Please login again.');
        } else {
          this.toastr.error(error.error?.message || 'Failed to delete news');
        }
        return of(null);
      })
    );
  }

}
