import { Component, inject, Input, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clinic } from '../../../../core/types/Clinic';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ClinicService } from '../../../../core/services/clinic.service';
import { ToastService } from '../../../../core/services/toast.service';
import { EmailService } from '../../../../core/services/email.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ModalType = 'approve' | 'reject' | 'sendEmail';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
  imports: [CommonModule, DropdownComponent, ModalComponent],
})
export class DynamicTableComponent implements OnInit {
  @Input() data = signal<Clinic[]>([]);

  private readonly clinicService = inject(ClinicService);
  private readonly toastService = inject(ToastService);
  public readonly emailService = inject(EmailService);
  private readonly destroyRef = inject(DestroyRef);

  clinicId = '';
  email = '';
  activeDropdown: string | null = null;
  activeModal: ModalType | null = null;

  ngOnInit(): void { }

  setModal(modalType: ModalType, clinicId: string): void {
    this.clinicId = clinicId;
    this.activeModal = modalType;
    console.log(`Modal: ${modalType}, Clinic ID: ${clinicId}`);
  }

  toggleDropdown(dropdownId: string): void {
    this.activeDropdown = this.activeDropdown === dropdownId ? null : dropdownId;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  approveClinic(): void {
    this._handleClinicAction(
      () => this.clinicService.ApprovedClinicAccount(this.clinicId),
      'Clinic account approved successfully',
      'Failed to approve clinic account'
    );
  }

  rejectClinic(): void {
    this._handleClinicAction(
      () => this.clinicService.rejectClinic(this.clinicId),
      'Clinic account rejected successfully',
      'Failed to reject clinic account'
    );
  }



  private _handleClinicAction(
    actionFn: () => ReturnType<ClinicService['ApprovedClinicAccount']>,
    successMsg: string,
    errorMsg: string
  ): void {
    if (!this.clinicId) return;

    actionFn()
      .pipe(
        tap(response => {
          if (response.statusCode === 200) {
            this.toastService.showSuccess(successMsg);
            this._removeClinicFromList();
          } else {
            this.toastService.showError(errorMsg);
          }
          this._resetModalState();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private _removeClinicFromList(): void {
    this.data.update(clinics => clinics.filter(clinic => clinic.id !== this.clinicId));
  }

  private _resetModalState(): void {
    this.activeModal = null;
    this.clinicId = '';
  }
}
