import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ChildrenOutletContexts,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { EmailBoxComponent } from '../../shared/components/email-box/email-box.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AdminHeaderComponent } from '../admin-dashboard/components/admin-header/admin-header.component';
import { SidebarComponent } from '../admin-dashboard/components/sidebar/sidebar.component';
import { routingAnimation } from '../../core/animations/routingAnimation'; // Import the animation
import { NotificationService } from '../../core/services/notifcation.service';

@Component({
  selector: 'app-clinic-dasboard',
  templateUrl: './clinic-dasboard.component.html',
  styleUrls: ['./clinic-dasboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminHeaderComponent,
    RouterOutlet,
    SidebarComponent,
    ToastComponent,
    EmailBoxComponent,
  ],
  animations: [routingAnimation], // Add the animations property
})
export class ClinicDasboardComponent implements OnInit {
  showSidebar: any = true;
  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }

  notifications: string[] = [];

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
