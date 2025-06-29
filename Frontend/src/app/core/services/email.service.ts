import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../../environments/config';
import { Observable, Observer, Subject } from 'rxjs';
import { IBaseApiResponse } from '../models/interface/IBaseApiResponse';

@Injectable({ providedIn: 'root' })
export class EmailService {
    private apiUrl = `${config.API_URL}/api/auth/send-email`;
    private ActiveEmailBox = new Subject<boolean>();
    private email = new Subject<string>();

    
    email$ = this.email.asObservable();
    _activeEmailBox = this.ActiveEmailBox.asObservable();

    constructor(private http: HttpClient) { }

    activeBox(email: string): void {
        this.email.next(email);
        this.ActiveEmailBox.next(true);
    }
    closeBox(): void {
        this.ActiveEmailBox.next(false);
        this.email.next('');
    }

    sendEmail(emailData: { emailTo: string; subject: string; body: string; attachments: File[] }): Observable<IBaseApiResponse> {
        const formData = new FormData();
        formData.append('EmailTo', emailData.emailTo);
        formData.append('Subject', emailData.subject);
        formData.append('Body', emailData.body);

        emailData.attachments.forEach(file => {
            formData.append('Attachments', file);
        });

        return this.http.post<IBaseApiResponse>(this.apiUrl, formData);
    }

}
