import {
  Component,
  ElementRef,
  signal,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardCartComponent } from "../../components/dashboard-cart/dashboard-cart.component";
import { PtientsOverviewChartComponent } from "../../components/ptients-overview-chart/ptients-overview-chart.component";
import { DropdownModule } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { DashboardCounters } from '../../../../core/models/interface/IDashboardCounters';
import { AnalysisService } from '../../../../core/services/analysis.service';
import { ClinicDTO, DoctorService } from '../../../../core/services/doctor.service';
import { AuthService } from '../../../../core/services/auth.service';
import { IAppointmentWithPatient } from '../../../../core/models/interface/IAppointmentWithPatient';
import { IPaginationParam } from '../../../../core/models/interface/IPaginationParam';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    DashboardCartComponent,
    CommonModule,
    FormsModule,
    PtientsOverviewChartComponent,
    DropdownModule
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  public days: { date: number; dayName: string }[] = [];
  public scrollAmount = 100;
  public today = new Date().getDate();
  public timeNow = signal<Date>(new Date());
  public dashboardData = signal<DashboardCounters | null>(null);
  private subscription: Subscription | null = null;
  public IsActive!: number;
  public selectedClinic: string = 'clinic1';
  public clinicInfo = signal<ClinicDTO | null>(null);
  private PaginationParam: IPaginationParam = {
    PageIndex: 1,
    pageSize: 6,
  };

  constructor(public authService: AuthService, private analysisService: AnalysisService, private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.doctorService.currentClinic$.subscribe((clinic) => {
      this.clinicInfo.set(clinic!);
      console.log(clinic);
    });
    this.generateMonthDays();
    this.IsActive = this.today;
    this.subscription = this.analysisService.getDoctorDashboard().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
      },
      error: (err) => {
        console.error('Error fetching doctor dashboard data:', err);
      }
    });
    this.loadAppointments();

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const dayItems = this.scrollContainer.nativeElement.querySelectorAll('.day-item');
      const today = this.today.toString();

      const todayElement = Array.from(dayItems).find((el) =>
        (el as HTMLElement).textContent?.includes(today)
      ) as HTMLElement | undefined;

      if (todayElement) {
        const container = this.scrollContainer.nativeElement as HTMLElement;
        const offsetLeft = todayElement.offsetLeft;

        container.scrollTo({
          left: offsetLeft - container.clientWidth / 1.5 + todayElement.clientWidth / 1.5,
          behavior: 'smooth'
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  generateMonthDays(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
      this.days.push({ date: i, dayName });
    }
  }

  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
  }

  public appointments = signal<IAppointmentWithPatient[]>([]);

  setDate(day: number): void {
    const newDate = new Date(this.timeNow());
    newDate.setDate(day);
    this.timeNow.set(newDate);
    this.IsActive = day;

    this.loadAppointments();

  }
  loadAppointments(): void {
    const clinic = this.clinicInfo();
    if (!clinic) return;
    const formattedDate = this.timeNow().toISOString();
    this.doctorService.getAppointmentsByDate(this.PaginationParam, clinic.id, formattedDate)
      .subscribe({
        next: (res) => {
          this.appointments.set(res.data);
          console.log('Appointments:', res.data);
        },
        error: (err) => {
          console.error('Error fetching appointments:', err);
        }
      });
  }
}
