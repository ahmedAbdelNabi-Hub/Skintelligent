import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationsComponent } from '../../../../shared/components/notifications/notifications.component';
import { NotificationService } from '../../../../core/services/notifcation.service';
@Component({
  selector: 'app-admin-header',
  imports: [CommonModule, NotificationsComponent, RouterLink],
  standalone: true,
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95)' })
        ),
      ]),
    ]),
  ],
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  @Output() onToggleSideBar = new EventEmitter<void>();
  isFullScreen = false;
  private signalRService = inject(NotificationService);
  notificationSub: any;
  notificationCount: any;

  ngOnInit(): void {
    this.listenForNewNotifications();
  }

  private listenForNewNotifications() {
    this.signalRService.startConnection().then(() => {
      this.notificationSub = this.signalRService.notification$.subscribe(
        (message: any) => {
          console.log('New notification:', message);
          this.notificationCount = message.count;
        }
      );
    });
  }

  toggleSidebar() {
    this.onToggleSideBar.emit();
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.isFullScreen = true; // Update state
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      this.isFullScreen = false; // Update state
    }
  }
  ngOnDestroy(): void {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }
}
