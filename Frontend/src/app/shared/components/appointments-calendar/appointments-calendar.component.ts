import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { WeekDaysFromDatePipe } from '../../pipes/week-days-from-date-pipe.pipe';
import { Subject, takeUntil, tap } from 'rxjs';
import { formatDateToLocalInput } from '../../../core/helper/formatDateToLocalInput';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { fadeAnimation } from '../../../core/animations/fadeAnimation';

@Component({
  selector: 'app-appointments-calendar',
  templateUrl: './appointments-calendar.component.html',
  styleUrls: ['./appointments-calendar.component.css'],
  standalone: true,
  animations: [fadeAnimation],
  imports: [CommonModule, WeekDaysFromDatePipe],
})
export class AppointmentsCalendarComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) selectedDate;
  @Input() doctorId!: string;
  @Input() isSelectedAppointmentBooked: boolean = false;
  @Input() change!: boolean;
  @Output() onAppointmentSelected = new EventEmitter();
  days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  private clinicId = signal<number>(0);
  private appointmentService = inject(AppointmentService);
  appointmentsByWeek = signal<Record<string, any[]>>({});
  private destroy$ = new Subject<void>();
  selectedAppointment;

  constructor(private doctorService: DoctorService) { }

  ngOnInit() {
    this.doctorService.currentClinic$.subscribe((clinic) => {
      this.clinicId.set(clinic!.id);
      this.fetchAppointmentsByWeek(formatDateToLocalInput(this.selectedDate));
    });
    this.fetchAppointmentsByWeek(formatDateToLocalInput(this.selectedDate));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      this.fetchAppointmentsByWeek(
        formatDateToLocalInput(changes['selectedDate'].currentValue)
      );
    }
    if (changes['change']) {
      if (this.selectedAppointment) {
        this.selectedAppointment.isBooked = true;
      }
      this.fetchAppointmentsByWeek(formatDateToLocalInput(this.selectedDate));
    }
  }

  isEmpty(appointment: any): boolean {
    return Object.keys(appointment).length === 0;
  }

  processAppointments(Data: Record<string, any[]>): void {
    const maxAppointments = Math.max(
      ...this.days.map((day) => Data[day]?.length || 3)
    );
    const newWeekData: Record<string, any[]> = {};
    this.days.forEach((day) => {
      const appointments = Data[day] || [];
      const emptySlots = maxAppointments - appointments.length;
      newWeekData[day] = [...appointments, ...Array(emptySlots).fill({})];
    });

    this.appointmentsByWeek.set(newWeekData);
  }

  fetchAppointmentsByWeek(date: string) {
    this.appointmentService
      .fetchAppointmentsByWeek(this.clinicId(), date, this.doctorId)
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          console.log(res);
          this.processAppointments(res);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
