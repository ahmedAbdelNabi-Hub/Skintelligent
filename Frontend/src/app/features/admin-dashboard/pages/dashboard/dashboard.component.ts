import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import { ClinicService } from '../../../../core/services/clinic.service';
import { Clinic } from '../../../../core/types/Clinic';

import { DashboardStatsCardComponent } from './components/dashboard-stats-card/dashboard-stats-card.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { RecentlyDoctorComponent } from "./components/recently-doctor/recently-doctor.component";
import { RadarChartComponent } from './components/radar-chart/radar-chart.component';
import { AnalysisService } from '../../../../core/services/analysis.service';
import { IAdminDashboard } from '../../../../core/models/interface/Admin/IAdminDashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardStatsCardComponent,
    DynamicTableComponent,
    RadarChartComponent,
    RecentlyDoctorComponent,
    
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private clinicService = inject(ClinicService);
  private dashboardService = inject(AnalysisService);
  private destroyRef = inject(DestroyRef);

  readonly unApprovedClinics = signal<Clinic[]>([]);
  readonly isLoading = signal(false);

  readonly dashboardData = signal<IAdminDashboard | null>(null);
  readonly overview = computed(() => this.dashboardData()?.overview ?? null);

  readonly doctorGrowth = computed(() => this.dashboardData()?.doctorGrowth ?? []);
  readonly patientGrowth = computed(() => this.dashboardData()?.patientGrowth ?? []);
  readonly appointmentVolume = computed(() => this.dashboardData()?.appointmentVolume ?? []);

  readonly hasUnapproved = computed(() => this.unApprovedClinics().length > 0);

  ngOnInit(): void {
    this.loadUnapprovedClinics();
    this.loadDashboardStats();
  }

  private loadUnapprovedClinics(): void {
    this.isLoading.set(true);
    this.clinicService.getUnapprovedClinics().pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(res => {
        this.unApprovedClinics.set(res?.data ?? []);
        this.isLoading.set(false);
        console.log(this.unApprovedClinics())
      })
    ).subscribe();
  }

  private loadDashboardStats(): void {
    this.dashboardService.getAdminDashboard().pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(data => this.dashboardData.set(data))
    ).subscribe();
  }
}
