import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AsyncDataHandler } from '../../../../core/models/classes/AsyncDataHandler';
import { IPagination } from '../../../../core/models/interface/IPagination';
import { ClinicService } from '../../../../core/services/clinic.service';
import { Clinic } from '../../../../core/types/Clinic';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from '../../../admin-dashboard/components/dynamic-table/dynamic-table.component';
import { BarChartComponent } from '../../../admin-dashboard/pages/dashboard/components/bar-chart/bar-chart.component';
import { DashboardStatsCardComponent } from '../../../admin-dashboard/pages/dashboard/components/dashboard-stats-card/dashboard-stats-card.component';
import { RadarChartComponent } from '../../../admin-dashboard/pages/dashboard/components/radar-chart/radar-chart.component';
import { IClinicDashboard } from '../../../../core/models/interface/IClinicDashboard';
import { AnalysisService } from '../../../../core/services/analysis.service';
import { IDoctorPerformance } from '../../../../core/models/interface/IDoctorPerformance';
import { AreaChartComponent } from "./components/area-chart/area-chart.component";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports: [
    CommonModule,
    DashboardStatsCardComponent,
    AreaChartComponent
  ],
  standalone: true,
})
export class StatisticsComponent implements OnInit, OnDestroy {
  private _clinicService = inject(ClinicService);
  clinicDashboard: IClinicDashboard | null = null;
  doctorPerformanceData: IDoctorPerformance[] = [];
  monthlyAppointments: number[] = [];
  monthLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private analysisService: AnalysisService) { }

  ngOnInit(): void {
    this.analysisService.getClinicDashboard().subscribe({
      next: (data) => this.clinicDashboard = data,
      error: (err) => console.error('Failed to load clinic dashboard', err)
    });
    this.analysisService.getDoctorPerformance().subscribe(data => {
      this.doctorPerformanceData = data;
      // Generate sample monthly appointments data
      this.monthlyAppointments = data.reduce((acc, doctor) => {
        const appointmentsPerMonth = Math.floor(doctor.appointmentsThisMonth / 4);
        return acc.map(val => val + appointmentsPerMonth);
      }, new Array(12).fill(0));
    });
  }

  ngOnDestroy(): void {

  }
}
