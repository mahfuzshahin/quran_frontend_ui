import {AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import {CommonModule, DOCUMENT} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgApexchartsModule} from "ng-apexcharts";
import {Observable} from "rxjs";
import {SidebarStateService} from "../service/sidebar-state.service";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, NgApexchartsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements AfterViewInit, OnInit{
  isSidebarOpen$!: Observable<boolean>;
  constructor(private sidebarService: SidebarStateService, private elementRef: ElementRef,
              @Inject(DOCUMENT) private document: Document) {}
  ngAfterViewInit() {
    initFlowbite();

  }
  ngOnInit(){
    this.isSidebarOpen$ = this.sidebarService.isSidebarOpen$;
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // 1. Check if the sidebar is currently open
    this.isSidebarOpen$.subscribe(isOpen => {
      if (!isOpen) return; // Only run logic if the sidebar is open

      const targetElement = event.target as HTMLElement;

      // 2. Check if the click occurred OUTSIDE the sidebar element
      //    We check two conditions:
      //    a) The click target is NOT the sidebar element itself
      //    b) The click target is NOT a descendant of the sidebar element
      const clickedOutsideSidebar =
        !this.elementRef.nativeElement.contains(targetElement);

      // 3. We also need to prevent closing if the click came from the toggle button in the HEADER.
      //    Assuming the button has the ID 'toggleSidebarMobile'
      const clickedToggleButton =
        targetElement.closest('#toggleSidebarMobile');

      if (clickedOutsideSidebar && !clickedToggleButton) {
        // If the click is outside the sidebar AND not on the toggle button, close it.
        this.sidebarService.closeSidebar();
      }
    }).unsubscribe(); // Unsubscribe immediately after checking the current value
  }
}
