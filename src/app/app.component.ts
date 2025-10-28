 import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
 import {initFlowbite} from "flowbite";
 import {HeaderComponent} from "./header/header.component";
 import {NavComponent} from "./nav/nav.component";
 import {Observable} from "rxjs";
 import {CommonModule} from "@angular/common";
 import {AuthService} from "./service/auth.service";
 import {FooterComponent} from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavComponent,FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'news_portal_admin_ui';
  isLoggedIn$ = this.authService.isLoggedIn$;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    initFlowbite();
  }
}
