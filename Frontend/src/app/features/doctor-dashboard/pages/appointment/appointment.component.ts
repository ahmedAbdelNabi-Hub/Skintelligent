import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { WeekDaysFromDatePipe } from '../../../../shared/pipes/week-days-from-date-pipe.pipe';
import { formatDateToLocalInput } from '../../../../core/helper/formatDateToLocalInput';
import { fadeAnimation } from '../../../../core/animations/fadeAnimation';
import { IBaseApiResponse } from '../../../../core/models/interface/IBaseApiResponse';
import { ToastService } from '../../../../core/services/toast.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { AppointmentsCalendarComponent } from '../../../../shared/components/appointments-calendar/appointments-calendar.component';
@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    AppointmentsCalendarComponent,
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  animations: [fadeAnimation],
})
export class AppointmentComponent implements OnInit, OnDestroy {
  private appointmentService = inject(AppointmentService);
  private destroy$ = new Subject<void>();
  visible: boolean = false;
  activeModal: boolean | null = true;
  today = new Date();
  formattedToday = formatDateToLocalInput(new Date());
  reRednder = signal<boolean>(false);
  selectedDate: Date = new Date();
  appointmentForm!: FormGroup;
  timeSlots: string[] = [];
  appointmentsByWeek = signal<Record<string, any[]>>({});
  private clinicId = signal<number>(0);
  constructor(private fb: FormBuilder, private toastService: ToastService, private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.doctorService.currentClinic$.subscribe((clinic) => {
      this.clinicId.set(clinic!.id);
    });
    this.initializeForm();
  }

  initializeForm(): void {
    this.selectedDate = new Date();
    const currentDay = this.selectedDate.getDay();
    this.appointmentForm = this.fb.group({
      clinicId: [this.clinicId(), Validators.required],
      dailyStartTime: ['09:00:00', Validators.required],
      dailyEndTime: ['18:00:00', Validators.required],
      split: [Validators.required],
      Note: [''],
      day: [
        currentDay,
        [Validators.required, Validators.min(0), Validators.max(6)],
      ],
      isRepeating: [true, Validators.required],
      startFromDate: [formatDateToLocalInput(new Date()), Validators.required],
      repeatUntil: [this.getFutureDate(30), Validators.required],
    });
  }



  onDateChange(date: Event): void {
    const input = event?.target as HTMLInputElement;
    this.selectedDate = new Date(input.value);
  }

  getFutureDate(daysAhead: number): string {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return futureDate.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    this.appointmentForm.patchValue({ clinicId: this.clinicId() });
    if (this.appointmentForm.invalid) {
      this.toastService.showError('Please complete the form correctly.');
      return;
    }
    const formValue = this.appointmentForm.value;
    console.log('Submitting form:', formValue);
    this.appointmentService
      .createAppointment(formValue)
      .pipe(
        takeUntil(this.destroy$),
        tap((response: IBaseApiResponse) => {
          this.toastService.showSuccess(response.message);
          this.reRednder.set(!this.reRednder());
        }),
        catchError((error) => {
          this.toastService.showError(
            error?.error?.message || 'Error creating appointment'
          );
          return of('');
        })
      )
      .subscribe();
  }

  showDialog(): void {
    this.visible = true;
  }
  hideDialog(): void {
    this.visible = false;
  }
  refreashAppointments(): void {
    this.reRednder.set(!this.reRednder());
  }
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
