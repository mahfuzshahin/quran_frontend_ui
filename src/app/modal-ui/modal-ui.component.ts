import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

interface User {
  fullName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-modal-ui',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-ui.component.html',
  styleUrl: './modal-ui.component.css'
})
export class ModalUiComponent implements OnInit {
  isModalOpen: boolean = false;
  userModel: User = {
    fullName: '',
    email: '',
    role: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.userModel = { fullName: '', email: '', role: '' };
    }
  }

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form Submitted!', this.userModel);
      alert(`User ${this.userModel.fullName} created successfully!`);
      this.toggleModal();
    } else {
      console.error('Form is invalid.');
    }
  }


}
