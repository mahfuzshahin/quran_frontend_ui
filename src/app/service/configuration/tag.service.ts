import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Tag} from "../../model/tag";
import {AuthService} from "../auth.service";
import {environment} from "../../../environment/environment";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private httpClient: HttpClient, private authService: AuthService, private toastr: ToastrService) { }
  getTag() {
    return this.httpClient.get<any>('http://localhost:3000/api/tag' ).pipe(
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

  postTag(tag: Tag){
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null);
    }
    const body=JSON.stringify(tag);
    return this.httpClient.post(environment.api_url +'/tag', body,{headers}).pipe(catchError((error:any, caught:Observable<any>):Observable<any> =>{
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of()
    }))
  }

  putTag(tag: Tag, id:any){
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null);
    }
    const body = JSON.stringify(tag);
    return this.httpClient.put<any>(`${environment.api_url}/tag/${id}`,body,{headers}).pipe(catchError((error:any, caught:Observable<any>):Observable<any> =>{
      if(error.status === 406){
        this.toastr.warning(error.error.message);
      }else{
        this.toastr.error(error.error.error);
      }
      return of();
    }))
  }
  deleteTag(id: number) {
    const headers = this.authService.getAuthHeaders(true);
    if (!headers) {
      this.toastr.error('You are not authenticated.');
      return of(null); // return observable to avoid TS error
    }

    return this.httpClient.delete(`${environment.api_url}/tag/${id}`, { headers }).pipe(
      catchError((error: any) => {
        console.log(error)
        if (error.status === 404) {
          this.toastr.error('Tag not found');
        } else if (error.status === 401) {
          this.toastr.error('Unauthorized. Please login again.');
        } else {
          this.toastr.error(error.error?.message || 'Failed to delete tag');
        }
        return of(null);
      })
    );
  }

}
