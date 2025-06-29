import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { config } from '../../../environments/config';
import { IReportResponse } from '../models/interface/IReportResponse';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = `${config.API_Test_Localhost}/api/chats`; 

  constructor(private http: HttpClient) {}

  getReport(conversationId: number): Observable<{
    date: string;
    sessionId: string;
    diagnoses: string[];
    id : number;
  }> {
    return this.http.get<IReportResponse>(`${this.baseUrl}/report/${conversationId}`).pipe(
      map(res => ({
        date: res.date,
        sessionId: res.sessionId,
        diagnoses: JSON.parse(res.differentialDiagnosesJson),
        id : res.id
      }))
    );
  }
}
