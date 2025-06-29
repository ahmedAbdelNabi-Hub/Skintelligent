import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PatientService } from '../../../../core/services/patient.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './patient-profile.component.html',
})
export class PatientProfileComponent implements OnInit {
  t;
  private patientService = inject(PatientService);
  private appointmentService = inject(AppointmentService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  patient: any;
  appointments: any[] = [];
  isEditing = false;
  isChangingPassword = false;

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    address: ['', Validators.required],
  });

  passwordForm: FormGroup = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  ngOnInit(): void {
    this.loadPatientData();
    this.loadAppointments();
  }

  private loadPatientData(): void {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
    this.patientService.getPatientDetails(userId).subscribe({
      next: (patient: any) => {
        this.patient = patient;
        this.profileForm.patchValue({
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          address: patient.address,
        });
      },
      error: (error) => {
        this.toastService.showError('Failed to load patient data');
      },
    });
  }

  private loadAppointments(): void {
    // TODO: Implement appointment loading logic when API is available
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.patient);
    }
  }

  toggleChangePassword(): void {
    this.isChangingPassword = !this.isChangingPassword;
    if (!this.isChangingPassword) {
      this.passwordForm.reset();
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      // TODO: Implement update profile logic when API is available
      this.toastService.showSuccess('Profile updated successfully');
      this.isEditing = false;
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      // TODO: Implement change password logic when API is available
      this.toastService.showSuccess('Password changed successfully');
      this.isChangingPassword = false;
      this.passwordForm.reset();
    }
  }

  cancelAppointment(appointmentId: number): void {
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: () => {
        this.toastService.showSuccess('Appointment cancelled successfully');
        this.loadAppointments();
      },
      error: () => {
        this.toastService.showError('Failed to cancel appointment');
      },
    });
  }

  private passwordMatchValidator(
    group: FormGroup
  ): { [key: string]: any } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
}
