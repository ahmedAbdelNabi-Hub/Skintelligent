import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { AsyncDataHandler } from '../../../../core/models/classes/AsyncDataHandler';
import { IPagination } from '../../../../core/models/interface/IPagination';
import { IPaginationParam } from '../../../../core/models/interface/IPaginationParam';
import { ClinicService } from '../../../../core/services/clinic.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { Doctor } from '../../../../core/types/Doctor';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { Subject, Subscription, of } from 'rxjs';
import { fadeAnimation } from '../../../../core/animations/fadeAnimation';
import { DefaultImagePipe } from '../../../../shared/pipes/defaultImage.pipe';

@Component({
  selector: 'app-doctors-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DefaultImagePipe],
  templateUrl: './doctors-table.component.html',
  styleUrl: './doctors-table.component.scss',
  animations: [fadeAnimation],
})
export class DoctorsTableComponent implements OnInit, OnDestroy {
  public _asyncDataHandler = new AsyncDataHandler<IPagination<Doctor>>();
  public Doctors = signal<Doctor[]>([]);
  public searchControl = new FormControl('');
  public searchMessage: string = '';
  private searchSubscription!: Subscription;
  private destroy$ = new Subject<void>();

  public Math = Math;
  public pagination !: IPagination<Doctor>;
  private PaginationParam: IPaginationParam = {
    PageIndex: 1,
    pageSize: 6,
  };

  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 6;
  pages: number[] = [];
  email: string = '';


  private doctroService = inject(DoctorService);

  constructor() { }

  ngOnInit(): void {
    this.fatchAllDoctor();
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) =>
          this.doctroService
            .getAllDoctors({
              ...this.PaginationParam,
              Search: searchTerm ?? '',
            })
            .pipe(
              catchError((error) => {
                console.error('Error fetching doctors:', error);
                this.searchMessage = 'Error fetching doctors';
                return of({ data: [] });
              })
            )
        )
      )
      .subscribe((result) => {
        if (result?.data?.length === 0) {
          this.searchMessage = 'Not Found Doctors';
        } else {
          this.searchMessage = '';
        }
        this.Doctors.set(result?.data || []);
      });
  }

  fatchAllDoctor(): void {
    this._asyncDataHandler.load(this.doctroService.getAllDoctors(this.PaginationParam));
    this._asyncDataHandler.data$
      .pipe(tap(response => {
        if (response) {
          this.Doctors.set(response.data!);
          this.pagination = response;
          this.updatePagination(response);
        }
      }))
      .subscribe();
  }
  updatePagination(data: IPagination<Doctor>): void {
    this.pageSize = data.pageSize;
    this.currentPage = data.pageIndex;
    this.totalPages = Math.ceil(data.count / data.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.PaginationParam.PageIndex = page;
      this.fatchAllDoctor();
    }
  }

  ngOnDestroy(): void {
    this._asyncDataHandler.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }
}
