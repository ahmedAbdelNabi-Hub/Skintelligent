import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { DoctorService } from '../../../../core/services/doctor.service';
import { IDoctor } from '../../../../core/models/interface/doctor/IDoctor';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, TabsModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);
  private toastService = inject(ToastService);
  public profileForm!: FormGroup;
  public statusCode: number = 0;
  public doctorId = 1019;

  private selectedFile: File | null = null;


  ngOnInit(): void {
    this.initForm();
    this.loadDoctorProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['Male', Validators.required],
      aboutMe: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      experienceYears: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      defaultExaminationFee: ['', [Validators.required, Validators.min(0)]],
      defaultConsultationFee: ['', [Validators.required, Validators.min(0)]],
      qualification: ['', Validators.required]
    });
  }

  private loadDoctorProfile(): void {
    this.doctorService.getDoctorById(this.doctorId).pipe(
      tap((doctor: IDoctor[]) => {
        if (doctor[0].dateOfBirth) {
          doctor[0].dateOfBirth = new Date(doctor[0].dateOfBirth).toISOString().split('T')[0];
        }
        this.profileForm.patchValue(doctor[0]);
        console.log(doctor[0])

      }),
      catchError(error => {
        console.error('Error fetching doctor:', error);
        this.statusCode = error?.error?.statusCode ?? 500;
        return of(null);
      })
    ).subscribe();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  public onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      console.warn('Form is invalid');
      return;
    }

    const formData = new FormData();
    const doctor = this.profileForm.value;

    for (const key in doctor) {
      if (doctor.hasOwnProperty(key)) {
        formData.append(key, doctor[key]);
      }
    }
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);
    }

    this.doctorService.updateProfileDoctor( formData).pipe(
      tap(response => {
        this.toastService.showSuccess(response.message);
      }),
      catchError(error => {
        this.toastService.showError(error.error.message);
        return of(null);
      })
    ).subscribe();
  }




}
