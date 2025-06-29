import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { EmailService } from '../../../../core/services/email.service';
import { DashboardStatsCardComponent } from '../../../admin-dashboard/pages/dashboard/components/dashboard-stats-card/dashboard-stats-card.component';
import { DoctorService } from '../../../../core/services/doctor.service';
import { IPatient } from '../../../../core/models/interface/Patient/IPatient';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IPaginationParam } from '../../../../core/models/interface/IPaginationParam';
import { IPagination } from '../../../../core/models/interface/IPagination';
import { ChatGroupComponent } from "../../../../shared/components/chat-group/chat-group.component";

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    MenuModule,
    ToastModule,
    ChatGroupComponent
  ],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientsComponent implements OnInit {
  public patients = signal<IPatient[]>([]);
  public isLoading = signal<boolean>(false);
  public items: any[] = [];
  public readonly patientList = computed(() => this.patients());
  public searchControl = new FormControl('');
  public searchMessage = signal<string>('');

  private emailService = inject(EmailService);
  private doctorService = inject(DoctorService);
  private destroy$ = new Subject<void>();
  private patientId: number | null = null;
  private email: string = '';
  public pagination !: IPagination<IPatient>;
  private PaginationParam: IPaginationParam = {
    PageIndex: 1,
    pageSize: 10,
  };


  // Pagination State
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  pages: number[] = [];

  constructor(private messageService: ToastService) { }

  ngOnInit(): void {
    this.loadPatients();
    this.initSearchSubscription();
    this.initializeMenuItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeMenuItems(): void {
    this.items = [
      {
        label: 'Delete',
        icon: 'bx bx-trash text-black bg-black px-2 py-1 rounded-sm',
        command: () => this.patientId && this.unassignPatient(this.patientId)
      },
      {
        label: 'Send Email',
        icon: 'bx bx-envelope text-black bg-black px-2 py-1 rounded-sm',
        command: () => this.emailService.activeBox(this.email)
      }
    ];
  }

  private initSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.isLoading.set(true)),
        switchMap(searchTerm =>
          this.doctorService.getPatients({
            ...this.PaginationParam,
            Search: searchTerm ?? ''
          }).pipe(
            catchError(error => {
              console.error('Error fetching patients:', error);
              this.searchMessage.set('Error fetching patients');
              return of({ data: [] });
            }),
            finalize(() => this.isLoading.set(false))
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        const patientsList = result?.data || [];
        this.patients.set(patientsList);
        this.searchMessage.set(patientsList.length === 0 ? 'No patients found' : '');
      });
  }

  loadPatients(): void {
    this.isLoading.set(true);
    this.doctorService.getPatients(this.PaginationParam)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false)),
        tap(res=>{
          this.updatePagination(res);

        })
      )
      .subscribe({
        next: (res) => {
          this.patients.set(res.data);
          console.log(res);
          this.pagination = res
          this.searchMessage.set('');
        },
        error: (err) => {
          this.searchMessage.set('Error loading patients');
          this.messageService.showError('Failed to load patients');
        }
      });
  }

  unassignPatient(patientId: number): void {
    this.isLoading.set(true);
    this.doctorService.unassignPatient(patientId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Patient unassigned successfully');
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error unassigning patient:', err);
          this.messageService.showError('Failed to unassign patient');
        }
      });
  }

  trackByPatientId(index: number, patient: IPatient): number {
    return patient.id;
  }

  setMenuData(email: string, patientId: number): void {
    this.email = email;
    this.patientId = patientId;
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
      this.loadPatients();
    }
  }



}
