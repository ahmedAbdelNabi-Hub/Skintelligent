import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from './toast.service';
import { config } from '../../../environments/config';
import { HttpClient } from '@angular/common/http';
import { IPaginationParam } from '../models/interface/IPaginationParam';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private hubConnection: signalR.HubConnection;
  private notificationSubject = new Subject<string>();
  public notification$ = this.notificationSubject.asObservable();

  getNotifications(PaginationParam: IPaginationParam) {
    return this._Http.get<any[]>(
      `${config.API_URL}/api/notifications?PageIndex=${PaginationParam.PageIndex}&PageSize=${PaginationParam.pageSize}`
    );
  }

  getUnreadNotificationsCount() {
    return this._Http.get<number>(
      `${config.API_URL}/api/notifications/unread-count`
    );
  }

  markNotificationAsRead(notificationId: string): Observable<any> {
    return this._Http.put<any>(
      `${config.API_URL}/api/notifications/${notificationId}/read`,
      {}
    );
  }

  markAllNotificationsAsRead(): Observable<any> {
    return this._Http.put<any>(
      `${config.API_URL}/api/notifications/mark-all-read`,
      {}
    );
  }

  constructor(private tost: ToastService, private _Http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${config.API_Test_Localhost}/hubs/notifications`, {
        accessTokenFactory: () => this.getJwtToken(),
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.notificationSubject.next(message);
      console.log('Received notification:', message);
      this.tost.showSuccess(message);
    });
    this.requestNotificationPermission();
  }

  private getJwtToken(): string {
    return localStorage.getItem('token') || '';
  }

  public startConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      return this.hubConnection
        .start()
        .then(() => console.log('SignalR Connected notifaction'))
        .catch((err) => console.error('Error connecting to SignalR:', err));
    }
    return Promise.resolve();
  }

  public stopConnection(): void {
    this.hubConnection.stop().then(() => console.log('SignalR Disconnected'));
  }

  private requestNotificationPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }

  private showBrowserNotification(
    title: string,
    options?: NotificationOptions
  ): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}
