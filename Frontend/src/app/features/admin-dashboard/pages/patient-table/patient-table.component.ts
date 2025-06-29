import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  signal,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../../../core/services/patient.service';
import { IPatient } from '../../../../core/models/interface/Patient/IPatient';
import {
  Subscription,
  Subject,
  tap,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AsyncDataHandler } from '../../../../core/models/classes/AsyncDataHandler';
import { IPagination } from '../../../../core/models/interface/IPagination';
import { IPaginationParam } from '../../../../core/models/interface/IPaginationParam';
import { Doctor } from '../../../../core/types/Doctor';
import { DefaultImagePipe } from '../../../../shared/pipes/defaultImage.pipe';
import { ToastService } from '../../../../core/services/toast.service';

interface Patient {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  address: string;
  lastVisitDate: Date;
  profilePicture?: string;
}

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PatientTableComponent implements OnInit, OnDestroy {
  public _asyncDataHandler = new AsyncDataHandler<IPagination<IPatient>>();
  public patients = signal<IPatient[]>([]);
  public searchControl = new FormControl('');
  public searchMessage: string = '';
  private searchSubscription!: Subscription;
  private destroy$ = new Subject<void>();

  public Math = Math;
  public pagination!: IPagination<Doctor>;
  private PaginationParam: IPaginationParam = {
    PageIndex: 1,
    pageSize: 6,
  };

  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 6;
  pages: number[] = [];
  constructor(
    private patientService: PatientService,
    private toasteService: ToastService
  ) {}

  ngOnInit(): void {
    this.getPatients();
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) =>
          this.patientService
            .getAllPatient({
              ...this.PaginationParam,
              Search: searchTerm ?? '',
            })
            .pipe(
              catchError((error) => {
                this.searchMessage = 'Error fetching patients';
                return of({ data: [] });
              })
            )
        )
      )
      .subscribe((result) => {
        if (result?.data?.length === 0) {
          this.searchMessage = 'Not Found Patients';
        } else {
          this.searchMessage = '';
        }
        this.patients.set(result?.data || []);
      });
  }

  getPatients(): void {
    this._asyncDataHandler.load(
      this.patientService.getAllPatient(this.PaginationParam)
    );
    this._asyncDataHandler.data$
      .pipe(
        tap((response) => {
          if (response) {
            this.patients.set(response.data);
            console.log(response.data);
            this.updatePagination(response);
          }
        })
      )
      .subscribe();
  }
  updatePagination(data: IPagination<IPatient>): void {
    this.pageSize = data.pageSize;
    this.currentPage = data.pageIndex;
    this.totalPages = Math.ceil(data.count / data.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.PaginationParam.PageIndex = page;
      this.getPatients();
    }
  }
  delete(id: number): void {
    this.patientService
      .delete(id)
      .pipe(
        takeUntil(this.destroy$),
        tap((response) => {
          if (response.statusCode === 200) {
            this.toasteService.showSuccess(response.message);
            this.getPatients();
          } else {
            this.toasteService.showError(response.message);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._asyncDataHandler.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
