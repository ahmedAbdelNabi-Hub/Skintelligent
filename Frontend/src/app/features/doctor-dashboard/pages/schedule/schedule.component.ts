import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WeekDaysFromDatePipe } from '../../../../shared/pipes/week-days-from-date-pipe.pipe';
import { catchError, of, Subject, takeUntil, tap, timer } from 'rxjs';
import { IPatientSchedule } from '../../../../core/models/interface/IPatientSchedule';
import { formatDateToLocalInput } from '../../../../core/helper/formatDateToLocalInput';
import { fadeAnimation } from '../../../../core/animations/fadeAnimation';
import { DoctorService } from '../../../../core/services/doctor.service';
import { EmailService } from '../../../../core/services/email.service';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule, WeekDaysFromDatePipe],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  animations: [fadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private appointmentService = inject(AppointmentService);
  private emailService = inject(EmailService);
  private toastService = inject(ToastService);
  public appointment = signal<IPatientSchedule[]>([]);
  private destroy$ = new Subject<void>();
  public selectedDate = signal<Date>(new Date());
  public formattedToday = formatDateToLocalInput(new Date())
  public openIndex: number | null = null;
  private clinicId = signal<number>(0);

  constructor(private doctorService: DoctorService) {
    effect(() => {
      const date = this.selectedDate();
      timer(300).subscribe(() => {
        this.getScheduleWeekly(date.toISOString());
      });
    });
  }

  ngOnInit(): void {
    this.doctorService.currentClinic$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clinic) => {
        if (!clinic) return;
        this.clinicId.set(clinic.id);
        this.getScheduleWeekly(this.selectedDate().toISOString());
      });
    this.getScheduleWeekly(this.selectedDate().toISOString());
  }

  getScheduleWeekly(date: string) {
    const id = this.clinicId();
    if (!id) return;
    this.appointmentService.getWeeklyPatients(0, id, date)
      .pipe(
        tap(res => {
          if (res) {
            this.appointment.set(res);
            console.log(res)
          }
        })
      )
      .subscribe();
  }


  onDateChange(event: Event): void {
    const input = event?.target as HTMLInputElement;
    const newDate = new Date(input.value);
    this.selectedDate.set(newDate);
    this.formattedToday = formatDateToLocalInput(newDate);
  }

  CancelAppointment(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId)
      .pipe(
        tap(res => {
          if (res) {
            this.toastService.showSuccess('Cancel appointment successfully');
            this.getScheduleWeekly(this.selectedDate().toISOString());
          }
        }),
        catchError(error => {
          this.toastService.showError(error.error.message);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  sentEmail(email: string): void {
    this.emailService.activeBox(email);
  }
  
  changeDay(days: number): void {
    const newDate = new Date(this.selectedDate());
    newDate.setDate(newDate.getDate() + days);
    this.selectedDate.set(newDate);
    this.formattedToday = formatDateToLocalInput(newDate);
  }
  trackByPatient(index: number, patient: any): string | number {
    return patient.id || index; // assuming each patient has a unique `id`
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    const clickedInside = target.closest('.relative.inline-block');
    if (!clickedInside) {
      this.openIndex = null;
    }
  }
  toggleDropdown(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
