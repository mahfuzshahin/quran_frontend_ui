import {Component, signal} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-basic-ui-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basic-ui-element.component.html',
  styleUrl: './basic-ui-element.component.css'
})
export class BasicUiElementComponent {
  isModalOpen = signal(false);
  isDropdownOpen = signal(false);
  alertVisible = signal(true);

  // Data for the badges
  badges = [
    { label: 'Primary', color: 'blue' },
    { label: 'Dark', color: 'dark' },
    { label: 'Success', color: 'green' },
    { label: 'Warning', color: 'yellow' },
    { label: 'Danger', color: 'red' },
  ];
  toggleModal = () => {
    this.isModalOpen.update(v => !v);
  }

  toggleDropdown = () => {
    this.isDropdownOpen.update(v => !v);
  }

  dismissAlert = () => {
    this.alertVisible.set(false);
  }
  getBadgeClasses(color: string): string {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'dark': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  }
}
