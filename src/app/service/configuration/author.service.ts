import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Author} from "../../model/author";
import {AuthService} from "../auth.service";
import {environment} from "../../../environment/environment";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private httpClient: HttpClient, private authService: AuthService, private toastr: ToastrService) { }
  getAuthor() {
    return this.httpClient.get<any>('http://localhost:3000/api/author' ).pipe(
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

  postAuthor(author: Author){
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null);
    }
    const body=JSON.stringify(author);
    return this.httpClient.post(environment.api_url +'/author', body,{headers}).pipe(catchError((error:any, caught:Observable<any>):Observable<any> =>{
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of()
    }))
  }

  putAuthor(author: Author, id:any){
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null);
    }
    const body = JSON.stringify(author);
    return this.httpClient.put<any>(`${environment.api_url}/author/${id}`,body,{headers}).pipe(catchError((error:any, caught:Observable<any>):Observable<any> =>{
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of();
    }))
  }
  deleteAuthor(id: number) {
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null); // return observable to avoid TS error
    }

    return this.httpClient.delete(`${environment.api_url}/author/${id}`, { headers }).pipe(
      catchError((error: any) => {
        console.log(error)
        if (error.status === 404) {
          this.toastr.error('Author not found');
        } else if (error.status === 401) {
          this.toastr.error('Unauthorized. Please login again.');
        } else {
          this.toastr.error(error.error?.message || 'Failed to delete author');
        }
        return of(null);
      })
    );
  }

}
