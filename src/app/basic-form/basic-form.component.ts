import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {EditorModule} from "@tinymce/tinymce-angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-basic-form',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule],
  templateUrl: './basic-form.component.html',
  styleUrl: './basic-form.component.css'
})
export class BasicFormComponent {
  jobDescription:any;
}
