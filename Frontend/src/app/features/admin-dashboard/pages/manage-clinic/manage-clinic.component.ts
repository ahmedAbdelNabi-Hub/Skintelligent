import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { ClinicDetailsComponent } from "../clinic-details/clinic-details.component";
import { ClinicService } from '../../../../core/services/clinic.service';
import { fadeAnimation } from '../../../../core/animations/fadeAnimation';
import { AsyncDataHandler } from '../../../../core/models/classes/AsyncDataHandler';
import { IPagination } from '../../../../core/models/interface/IPagination';
import { Clinic } from '../../../../core/types/Clinic';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, of, Subscription, switchMap, tap } from 'rxjs';
import { IPaginationParam } from '../../../../core/models/interface/IPaginationParam';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ToastService } from '../../../../core/services/toast.service';
import { EmailService } from '../../../../core/services/email.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-clinic',
  templateUrl: './manage-clinic.component.html',
  styleUrls: ['./manage-clinic.component.css'],
  animations: [fadeAnimation],
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, DropdownComponent, ClinicDetailsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageClinicComponent implements OnInit {
  public asyncDataHandler = new AsyncDataHandler<IPagination<Clinic>>();
  public _clinicService = inject(ClinicService);
  public activeDropdown: string | null = null;
  public clinics = signal<Clinic[]>([]);
  public activeModal: 'Delete' | 'Block' | 'active' | null = null;
  private clinicId: string = '';
  public Math = Math;
  public isLoading = signal<boolean>(false);
  private readonly _toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef); // Auto cleanup
  public _emailService = inject(EmailService);
  public searchControl = new FormControl('');
  public searchMessage: string = '';
  private searchSubscription!: Subscription;
  public pagination !: IPagination<Clinic>;
  private PaginationParam: IPaginationParam = {
    PageIndex: 1,
    pageSize: 5,
  };

  // Pagination State
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 5;
  pages: number[] = [];
  email: string = '';


  ngOnInit() {
    this.getapprovedClinics();
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) =>
          this._clinicService
            .getapprovedClinics({
              ...this.PaginationParam,
              Search: searchTerm ?? '',
            })
            .pipe(
              catchError((error) => {
                this.searchMessage = 'Error fetching Clinic';
                return of({ data: [] });
              })
            )
        )
      )
      .subscribe((result) => {
        if (result?.data?.length === 0) {
          this.searchMessage = 'Not Found Clinic';
        } else {
          this.searchMessage = '';
        }
        this.clinics.set(result?.data || []);
      });
  }


  setIdAndActivateModal(modalType: 'Delete' | 'Block' | 'active', clinicId: string) {
    this.clinicId = clinicId;
    this.activeModal = modalType;
  }

  setActiveDropdown(dropdownId: string): void {
    this.activeDropdown = this.activeDropdown === dropdownId ? null : dropdownId;
  }
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  getapprovedClinics(): void {
    this.asyncDataHandler.load(this._clinicService.getapprovedClinics(this.PaginationParam));
    this.asyncDataHandler.data$
      .pipe(
        tap(response => {
          if (response) {
            this.clinics.set(response.data!);
            this.pagination = response;
            console.log(response);
            this.updatePagination(response);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  deleteClinicAccount(): void {
    if (!this.clinicId) return;
    console.log(this.clinicId);
    this._clinicService.delete(+this.clinicId)
      .pipe(
        tap(response => {
          if (response.statusCode === 200) {
            this._toast.showSuccess(response.message);
            this.activeModal = null;
            this.getapprovedClinics();
          } else {
            this._toast.showError('Failed to delete clinic account');
            this.activeModal = null;
          }
        }),
        catchError(error => {
          this._toast.showError('An error occurred while deleting clinic');
          this.activeModal = null;
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }


  BlockClinicAccount(): void {
    if (!this.clinicId) return;
    this._clinicService.BlockClinicAccount(this.clinicId)
      .pipe(
        tap(response => {
          if (response.statusCode === 200) {
            this._toast.showSuccess(response.message);
            this.activeModal = null;
            this.getapprovedClinics();
          } else {
            this._toast.showError('Failed to Block clinic account');
            this.activeModal = null;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  clinicInfo(clinicId: string) {
    this._clinicService.ShowPageClinicDetails();
    this._clinicService.setClinicId(clinicId)
  }

  updatePagination(data: IPagination<Clinic>): void {
    this.pageSize = data.pageSize;
    this.currentPage = data.pageIndex;
    this.totalPages = Math.ceil(data.count / data.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.PaginationParam.PageIndex = page;
      this.getapprovedClinics();
    }
  }
}
