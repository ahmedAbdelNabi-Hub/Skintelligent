import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { Subject, catchError, finalize, takeUntil, tap } from 'rxjs';
import { DoctorService } from '../../../../core/services/doctor.service';
import { IDoctor } from '../../../../core/models/interface/doctor/IDoctor';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { DashboardStatsCardComponent } from '../../../admin-dashboard/pages/dashboard/components/dashboard-stats-card/dashboard-stats-card.component';
import { IPagination } from '../../../../core/models/interface/IPagination';
import { IReview } from '../../../../core/models/interface/doctor/IReview';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    RouterModule,
    TabsModule,
    DashboardStatsCardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProfileComponent implements OnInit, OnDestroy {
  private doctorService = inject(DoctorService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  public isLoading = signal<boolean>(false);
  public statusCode = signal<number>(0);
  public doctor = signal<IDoctor | null>(null);
  public reviews = signal<IPagination<IReview> | null >(null);

  ngOnInit(): void {
    this.loadDoctorProfile();
    this.loadDoctorReviews();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDoctorProfile(): void {
    this.isLoading.set(true);
    this.doctorService.getDoctorById(1019).pipe(
      takeUntil(this.destroy$),
      tap((doctor: IDoctor[]) => {
        this.doctor.set(doctor[0]);
      }),
      catchError(error => {
        this.statusCode.set(error?.error?.statusCode);
        this.toastService.showError(error.error.message || 'Failed to load doctor profile');
        return [];
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe();
  }

  private loadDoctorReviews(): void {
    this.isLoading.set(true);
    this.doctorService.getDoctorReviewById('22').pipe(
      takeUntil(this.destroy$),
      tap((response) => {
        if (response?.count!=0) {
          this.reviews.set(response);
          console.log(response);
        }
        else {
          this.statusCode.set(404);
        }
      }),
      catchError(error => {
        this.toastService.showError('Failed to load doctor reviews');
        return [];
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe();
  }
  
  get hasDoctorRating(): boolean {
    return this.doctor()?.rating !== undefined && this.doctor()?.rating !== null;
  }
  
}
