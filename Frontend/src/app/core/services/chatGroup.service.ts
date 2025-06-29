import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, take } from 'rxjs';
import { config } from '../../../environments/config';
import { IChatMessage } from '../models/interface/IChatMessage';
import { DoctorService } from './doctor.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ChatGroupService {
    private hubConnection: signalR.HubConnection;
    private _messages = signal<IChatMessage[]>([]);
    public readonly messages = this._messages;

    private _onlineUsers = signal<any[]>([]);
    public readonly onlineUsers = this._onlineUsers;

    constructor(
        private http: HttpClient,
        private doctorService: DoctorService,
        private authService: AuthService
    ) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${config.API_Test_Localhost}/hubs/chat`, {
                accessTokenFactory: () => this.getJwtToken(),
            })
            .withAutomaticReconnect()
            .build();

        this.registerHubEvents();
    }

    private getJwtToken(): string {
        return localStorage.getItem('token') ?? '';
    }

    private registerHubEvents(): void {
        this.hubConnection.on('ReceiveMessage', (message: IChatMessage) => {
            this._messages.update(prev => [...prev, message]);
            console.log('[SignalR] Received message:', message);
        });

        this.hubConnection.on('OnlineUsersChanged', (_group: string, users: any[]) => {
            this._onlineUsers.set(users);
            console.log('[SignalR] Online users updated:', users);
        });
    }

    private resolveClinicId(): Observable<number | null> {
        const role = this.authService.getUserRole()?.[0];

        if (role === 'clinic') {
            const storedId = this.authService.getClinicId();
            return of(storedId ? +storedId : null);
        }

        if (role === 'doctor') {
            return this.doctorService.currentClinic$.pipe(
                take(1),
                switchMap(clinic => of(clinic?.id ?? null))
            );
        }

        return of(null);
    }

    public startConnection(): void {
        if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) return;

        this.hubConnection
            .start()
            .then(() => {
                console.log('[SignalR] Connection established');
                this.joinClinicGroup();
            })
            .catch(err => console.error('[SignalR] Connection error:', err));
    }

    private joinClinicGroup(): void {
        this.resolveClinicId().pipe(take(1)).subscribe(clinicId => {
            if (!clinicId) return;

            const groupName = `clinic-${clinicId}`;

            this.hubConnection
                .invoke('GetOnlineUsersInGroup', groupName)
                .then(users => {
                    this._onlineUsers.set(users);
                    console.log('[SignalR] Users in group:', users);
                })
                .catch(err => console.error('[SignalR] Failed to get group users:', err));
        });
    }

    public stopConnection(): void {
        if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
            this.hubConnection
                .stop()
                .then(() => console.log('[SignalR] Connection stopped'))
                .catch(err => console.error('[SignalR] Stop error:', err));
        }
    }

    public sendToClinicGroup(message: string): void {
        this.resolveClinicId().pipe(take(1)).subscribe(clinicId => {
            if (!clinicId) {
                console.warn('[SignalR] Cannot send message: no clinic ID');
                return;
            }

            this.hubConnection
                .invoke('SendMessageToClinicGroup', clinicId, message)
                .catch(err => console.error('[SignalR] Send message error:', err));
        });
    }

    public getMessages(): Observable<IChatMessage[]> {
        return this.resolveClinicId().pipe(
            take(1),
            switchMap(clinicId => {
                if (!clinicId) return of([]);
                const group = `clinic-${clinicId}`;
                return this.http.get<IChatMessage[]>(`${config.API_Test_Localhost}/api/chats/group/${group}`);
            })
        );
    }

    public clearMessages(): void {
        this._messages.set([]);
    }

    public setMessages(messages: IChatMessage[]): void {
        this._messages.set(messages);
    }
}
