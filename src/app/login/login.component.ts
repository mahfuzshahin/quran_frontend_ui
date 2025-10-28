import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../service/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) {}
  login() {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (res) => {
        if (res.data) {
          console.log(res.data.access_token)
          this.authService.saveSession(res.data.access_token);
          this.toastr.success('Login successful!');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error('Invalid response from server');
        }
      },
      error: () => {
        this.toastr.error('Invalid username or password');
      }
    });
  }
}
