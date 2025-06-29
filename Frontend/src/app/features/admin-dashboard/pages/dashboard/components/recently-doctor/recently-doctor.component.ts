import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations'; // Import animation functions
import { DoctorService } from '../../../../../../core/services/doctor.service';
import { IPagination } from '../../../../../../core/models/interface/IPagination';
import { IDoctor } from '../../../../../../core/models/interface/doctor/IDoctor';
import { AsyncDataHandler } from '../../../../../../core/models/classes/AsyncDataHandler';
import { IPaginationParam } from '../../../../../../core/models/interface/IPaginationParam';
import { Doctor } from '../../../../../../core/types/Doctor';
import { tap } from 'rxjs';
import { DefaultImagePipe } from '../../../../../../shared/pipes/defaultImage.pipe';

@Component({
  selector: 'app-recently-doctor',
  standalone: true,
  imports: [CommonModule , DefaultImagePipe],
  templateUrl: './recently-doctor.component.html',
  styleUrls: ['./recently-doctor.component.scss'],
  animations: [
    trigger('doctorFadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class RecentlyDoctorComponent implements OnInit, OnDestroy {

  private doctorService = inject(DoctorService);
  public recentlyDoctor = signal<IPagination<Doctor> | null>(null);
  public recentlyDoctorHandlar = new AsyncDataHandler<IPagination<Doctor>>();
  public PaginationParams: IPaginationParam = {
    PageIndex: 1,
    pageSize: 10,
  };

  public allDoctors = signal<Doctor[]>([])
  public visibleDoctors = signal<Doctor[]>([])
  public doctorsPerPage = 4;
  public pages: number[] = [];
  public currentPage = 1;
  private autoplayInterval!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.getRecentlyDoctor();
  }

  getRecentlyDoctor(): void {
    this.recentlyDoctorHandlar.load(this.doctorService.getRecentlyDoctors(this.PaginationParams));
    this.recentlyDoctorHandlar.data$.pipe(
      tap(data => {
        if (data) {
          this.recentlyDoctor.set(data);
          this.allDoctors.set(data.data);
          const totalPages = Math.ceil(data.count / this.doctorsPerPage);
          this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
          this.updateVisibleDoctors();
          this.startAutoPagination(totalPages);
        }
      })
    ).subscribe();
  }

  updateVisibleDoctors(): void {
    const start = (this.currentPage - 1) * this.doctorsPerPage;
    const end = start + this.doctorsPerPage;
    this.visibleDoctors.set(this.allDoctors().slice(start, end));
  }

  startAutoPagination(totalPages: number): void {
    clearInterval(this.autoplayInterval); // clear if already running
    this.autoplayInterval = setInterval(() => {
      this.currentPage = this.currentPage >= totalPages ? 1 : this.currentPage + 1;
      this.updateVisibleDoctors();
    }, 8000);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateVisibleDoctors();
  }

  ngOnDestroy(): void {
    this.recentlyDoctorHandlar.unsubscribe();
    clearInterval(this.autoplayInterval);
  }
}
