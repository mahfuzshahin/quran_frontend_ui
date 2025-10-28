import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/login`, credentials);
  }

  saveSession(token: string) {
    sessionStorage.setItem('auth_token', token);
    this.isLoggedInSubject.next(true); // ✅ Notify app that user is logged in
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    this.isLoggedInSubject.next(false); // ✅ Notify app that user logged out
  }
  private hasToken(): boolean {
    return !!this.getToken();
  }
  private getToken(): string | null {
    return sessionStorage.getItem('auth_token'); // returns actual token
  }

  getAuthHeaders(withContentType: boolean = false) {
    const token = this.getToken();
    if (!token) return null;

    const headers: any = {
      'Authorization': `Bearer ${token}`, // <-- actual token
    };

    if (withContentType) headers['Content-Type'] = 'application/json';
    return headers;
  }

  // Optional: handle missing token
  handleAuthError() {
    console.error('No auth token found!');
    return;
  }
}
