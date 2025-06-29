import { Component, Input } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';
import { config } from '../../../../../environments/config';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  standalone: true,
  imports: [EditorModule, FormsModule]
})
export class TextEditorComponent {
  text: string = '';
  url = `${config.API_Test_Localhost}`;
  @Input() reportId: number | undefined;
  constructor(private http: HttpClient , private toast : ToastService) {}

  saveNote() {
    const reportId = this.reportId;
    this.http.post(`${this.url}/api/reports/${reportId}/notes`, {
      note: this.text
    }).subscribe({
      next: () => {
        this.toast.showSuccess('Note saved successfully!');
        this.text = ''; 
      },
      error: () => {
        this.toast.showError('Failed to save note.');
      }
    });
  }
}
