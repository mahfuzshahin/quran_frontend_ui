import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "./auth.service";
import {Ayat} from "../model/ayat";
import {environment} from "../../environment/environment";
import {Keyword} from "../model/keyword";

@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  constructor(private httpClient: HttpClient, private authService: AuthService, private toastr: ToastrService) { }
  getKeyword() {
    return this.httpClient.get<any>(environment.api_url+'/keywords' ).pipe(
      catchError((error: any): Observable<any> => {
        if (error.status === 404) {
          console.log(error.error.message || 'No employees found.');
        } else {
          console.log(error.error.message || 'An error occurred while fetching employees.');
        }
        return of([]);
      })
    );
  }
  postKeyword(keyword: Keyword){
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null);
    }
    const body=JSON.stringify(keyword);
    return this.httpClient.post(environment.api_url +'/keywords', body,{headers}).pipe(catchError((error:any, caught:Observable<any>):Observable<any> =>{
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of()
    }))
  }

  putAyat(ayat: Ayat, id:any){
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null);
    }
    const body = JSON.stringify(ayat);
    return this.httpClient.put<any>(`${environment.api_url}/ayat/${id}`,body,{headers}).pipe(catchError((error:any, caught:Observable<any>):Observable<any> =>{
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of();
    }))
  }
  deleteAyat(id: number) {
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null); // return observable to avoid TS error
    }

    return this.httpClient.delete(`${environment.api_url}/ayat/${id}`, { headers }).pipe(
      catchError((error: any) => {
        console.log(error)
        if (error.status === 404) {
          this.toastr.error('Ayat not found');
        } else if (error.status === 401) {
          this.toastr.error('Unauthorized. Please login again.');
        } else {
          this.toastr.error(error.error?.message || 'Failed to delete ayat');
        }
        return of(null);
      })
    );
  }

}
