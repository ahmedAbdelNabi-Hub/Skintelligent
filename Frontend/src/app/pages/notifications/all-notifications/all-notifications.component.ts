import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { NotificationService } from '../../../core/services/notifcation.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.css'],
  standalone: true,
  imports: [CommonModule, RelativeTimePipe, LoaderComponent],
})
export class AllNotificationsComponent implements OnInit {
  isLoading = false;
  notifications: any[] = []; // Initialize as empty, load in ngOnInit
  currentPage = 1;
  itemsPerPage = 5; // Load 5 items per page initially
  allLoaded = false;

  notificationService: any = inject(NotificationService);

  constructor() {}

  ngOnInit(): void {
    this.getNotifications(); // Load initial data
  }

  loadMoreNotifications() {
    this.currentPage = this.currentPage + 1;
    this.getNotifications();
  }

  getNotifications() {
    this.isLoading = true;
    this.notificationService
      .getNotifications({
        pageSize: 10,
        PageIndex: this.currentPage,
      })
      .subscribe((res: any) => {
        this.isLoading = false;
        this.notifications = [...this.notifications, ...res.data];
        console.log(this.notifications);
        this.allLoaded = this.notifications.length === res.count;
      });
  }

  markAllAsRead() {
    this.isLoading = true;
    this.notificationService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.isRead = true));
        console.log('All notifications marked as read');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
        this.isLoading = false;
      },
    });
  }

  onNotificationClick(notification: any) {
    if (!notification.isRead) {
      this.notificationService
        .markNotificationAsRead(notification.id)
        .subscribe({
          next: () => {
            notification.isRead = true;
            console.log('Notification marked as read:', notification);
          },
          error: (error) => {
            console.error('Error marking notification as read:', error);
          },
        });
    }
    // Additional logic for handling notification click (e.g., navigation)
  }
}
