import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { emailAnimation } from '../../../core/animations/emailBoxAnimations';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../../core/services/email.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { AsyncDataHandler } from '../../../core/models/classes/AsyncDataHandler';
import { IBaseApiResponse } from '../../../core/models/interface/IBaseApiResponse';
import { catchError, tap, finalize } from 'rxjs';

@Component({
  selector: 'app-email-box',
  imports: [CommonModule, FormsModule],
  animations: [emailAnimation],
  templateUrl: './email-box.component.html',
  styleUrl: './email-box.component.scss'
})
export class EmailBoxComponent implements OnInit, OnDestroy {
  private _emailService = inject(EmailService);
  private _toastService = inject(ToastService);
  _asyncDataHandler = new AsyncDataHandler<IBaseApiResponse>();

  showEmailComposer = signal<boolean>(false);
  emailTo = '';
  subject = '';
  body = '';
  attachments: File[] = [];

  constructor() { }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.attachments = Array.from(target.files);
    }
  }

  sendEmail() {
    if (!this.emailTo.trim() || !this.subject.trim() || !this.body.trim()) {
      this._toastService.showError("Please fill all required fields.");
      return;
    }

    this._asyncDataHandler.load(
      this._emailService.sendEmail({
        emailTo: this.emailTo,
        subject: this.subject,
        body: this.body,
        attachments: this.attachments,
      }).pipe(
      
        tap(res => {
          if (res?.statusCode === 200) {
            this._toastService.showSuccess("Email sent successfully!");
          }
        }),
        catchError(() => {
          this._toastService.showError("Failed to send email.");
          return [];
        }),
        finalize(() => {
          this.resetForm();
          this._emailService.closeBox();
        })
      )
    );
  }

  ngOnInit(): void {
    this._emailService.email$.subscribe(email => (this.emailTo = email));
    this._emailService._activeEmailBox.subscribe(response => {
      this.showEmailComposer.set(response);
    });
  }

  resetForm(): void {
    this.emailTo = '';
    this.subject = '';
    this.body = '';
    this.attachments = [];
  }

  toggleEmailComposer() {
    this.showEmailComposer.set(!this.showEmailComposer());
  }

  ngOnDestroy(): void {
    this._asyncDataHandler.unsubscribe();
  }
}
