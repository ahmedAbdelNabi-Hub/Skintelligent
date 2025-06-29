import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { routingAnimation } from '../../core/animations/routingAnimation';
import { EmailBoxComponent } from '../../shared/components/email-box/email-box.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AdminHeaderComponent } from '../admin-dashboard/components/admin-header/admin-header.component';
import { SidebarComponent } from '../admin-dashboard/components/sidebar/sidebar.component';
import { fadeAnimation } from '../../core/animations/fadeAnimation';
import { NotificationService } from '../../core/services/notifcation.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  animations: [fadeAnimation],
  imports: [
    CommonModule,
    RouterModule,
    AdminHeaderComponent,
    RouterOutlet,
    SidebarComponent,
    ToastComponent,
    EmailBoxComponent,
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  public showSidebar: any = true
  private signalRService = inject(NotificationService);

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.signalRService.notification$.subscribe(message => {
        console.log('New notification:', message);
      });
    });
  }
}
