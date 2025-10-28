// src/app/services/sidebar-state.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  // Use BehaviorSubject to hold the current state and emit updates
  private sidebarOpenSource = new BehaviorSubject<boolean>(false);

  // Expose the state as an observable for other components to subscribe to
  isSidebarOpen$ = this.sidebarOpenSource.asObservable();

  constructor() { }

  toggleSidebar() {
    this.sidebarOpenSource.next(!this.sidebarOpenSource.value);
  }

  // Optional: Add methods to explicitly open/close if needed
  closeSidebar() {
    this.sidebarOpenSource.next(false);
  }
}
