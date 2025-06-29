import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-stats-card',
  imports: [CommonModule],
  templateUrl: './dashboard-stats-card.component.html',
  styleUrl: './dashboard-stats-card.component.scss',
  standalone: true,
})
export class DashboardStatsCardComponent {

  @Input("data") data!:{};

  @Input({ required: true }) cards!: any[];
}
