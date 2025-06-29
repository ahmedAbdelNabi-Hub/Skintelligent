import { Component, Input, input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { Subject, takeUntil, tap } from 'rxjs';
import { ReportService } from '../../../../core/services/Report.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../../../environments/config';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TextEditorComponent],
})
export class PdfViewerComponent implements OnInit {
  summary: any = null;
  isModalOpen: boolean = false;
  newNote: string = '';
  diagnoses: string[] = [];
  conversationId !: number | string;
  image: string = '';
  private destroy$ = new Subject<void>();
  sessionDate!: string;
  sessionId!: string;
  reportId!: number;
  url = `${config.API_Test_Localhost}`;

  constructor(private toast: ToastService, private route: ActivatedRoute, private http: HttpClient, private reportService: ReportService) { }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const summaryJson = params.get('summaryJson');
      this.conversationId = params.get('conversationId') || '';
      this.image = params.get('image') || '';
      if (summaryJson) {
        try {
          this.summary = JSON.parse(decodeURIComponent(summaryJson));
        } catch (error) {
          console.error('Invalid summaryJson:', error);
        }
      }
    });
    this.reportService.getReport(+this.conversationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(report => {
        this.diagnoses = report.diagnoses;
        this.sessionDate = report.date;
        this.sessionId = report.sessionId;
        this.reportId = report.id;
      });
  }

  openNoteModal(): void {
    this.isModalOpen = true;
  }

  notesVisible = false;
  notes: { id : number, note: string; createdAt: string }[] = [];

  toggleNotes() {
    this.notesVisible = !this.notesVisible;

    if (this.notesVisible && this.notes.length === 0) {
      this.fetchNotes();
    }
  }

  fetchNotes() {
    const reportId = this.reportId;
    this.http.get<any[]>(`${this.url}/api/reports/${reportId}/notes`).subscribe((data) => {
      this.notes = data;
    });
  }
  deleteNote(noteId: number) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    this.http.delete(`${this.url}/api/report-notes/${noteId}`).subscribe({
      next: () => this.fetchNotes(),
      error: () => this.toast.showError('Failed to delete note.')
    });
  }

  closeNoteModal(): void {
    this.isModalOpen = false;
    this.newNote = '';
  }
}
