import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { config } from '../../../environments/config';
import { IConversation } from '../models/interface/IConversation';
import { IAssistantRequestDTO } from '../models/interface/IAssistantRequestDTO';
import { IAssistantResponse } from '../models/interface/IAssistantResponse';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private baseUrl = `${config.API_URL}/api/chats`;
    constructor(private http: HttpClient) { }
    getConversationById(id: number): Observable<IConversation> {
        return this.http.get<IConversation>(`${this.baseUrl}/${id}`).pipe(
            map((res) => ({
                ...res,
                jsonData: res.jsonData ? JSON.parse(res.jsonData) : null,
            }))
        );
    }

    sendMessage(request: IAssistantRequestDTO): Observable<IAssistantResponse> {
        return this.http.post<IAssistantResponse>(`${config.API_URL}/api/assistant/send`, request);
    }

    regenerateReport(conversationId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/reRenerate-report/${conversationId}`);
      }
      
      reSummary(conversationId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/re-summary/${conversationId}`);
      }
      
    deleteConversation(conversationId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/conversations/${conversationId}`);
      }
}
