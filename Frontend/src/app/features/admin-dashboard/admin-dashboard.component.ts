import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ChildrenOutletContexts,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { EmailBoxComponent } from '../../shared/components/email-box/email-box.component';
import { routingAnimation } from '../../core/animations/routingAnimation';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  animations: [routingAnimation],
  imports: [
    CommonModule,
    RouterModule,
    AdminHeaderComponent,
    RouterOutlet,
    SidebarComponent,
    ToastComponent,
    EmailBoxComponent,
  ],
  standalone: true,
})
export class AdminDashboardComponent {
  constructor(private contexts: ChildrenOutletContexts ) {
  }
  

  
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
