import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../../../core/directives/click-outside.directive';
import { NotificationService } from '../../../core/services/notifcation.service';
import { LoaderComponent } from '../loader/loader.component';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ClickOutsideDirective,
    LoaderComponent,
    RelativeTimePipe,
  ],
})
export class NotificationsComponent implements OnInit {
  showNotifications = false;
  @Input() unreadCount: any;
  notifications: any;
  isLoading: boolean = true;
  constructor(
    private notificationService: NotificationService,
    public router: Router
  ) {
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.getNotifications();
    }
  }

  markAsRead(notification: any) {
    if (!notification.isRead) {
      this.notificationService
        .markNotificationAsRead(notification.id)
        .subscribe({
          next: () => {
            notification.isRead = true;
            this.getUnreadNotificationsCount();
          },
          error: (error) => {
            console.error('Error marking notification as read:', error);
          },
        });
    }
  }

  markAllAsRead() {
    this.isLoading = true;
    this.notificationService.markAllNotificationsAsRead().subscribe({
      next: () => {
        if (this.notifications) {
          this.notifications.forEach((n) => (n.isRead = true));
        }
        this.getUnreadNotificationsCount();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
        this.isLoading = false;
      },
    });
  }
  ngOnInit() {
    this.getUnreadNotificationsCount();
  }
  getNotifications() {
    this.isLoading = true;
    this.notificationService
      .getNotifications({
        pageSize: 10,
        PageIndex: 1,
      })
      .subscribe((res: any) => {
        this.isLoading = false;
        this.notifications = res.data;
        console.log(this.notifications);
      });
  }

  getUnreadNotificationsCount() {
    this.notificationService
      .getUnreadNotificationsCount()
      .subscribe((data: any) => {
        this.unreadCount = data.unreadCount;
      });
  }
}
