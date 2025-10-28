// media.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import {environment} from "../../environment/environment";

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private http: HttpClient, private toastr: ToastrService, private authService: AuthService) {}

  uploadt(file: File): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      this.toastr.error('Unauthorized. Please login again.');
      return of(null);
    }

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // DO NOT set 'Content-Type' manually for FormData
    });

    return this.http.post(environment.api_url + '/media/upload', formData, { headers })
      .pipe(
        catchError((error) => {
          this.toastr.error(error?.error?.message || 'Upload failed');
          return of(null);
        })
      );
  }
  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string; media: any; url: string }>(
      environment.api_url + '/media/upload',
      formData
    );
  }


  getAll(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return of(null);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(environment.api_url + '/media', { headers });
  }
}
