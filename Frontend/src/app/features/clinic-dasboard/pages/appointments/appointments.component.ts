import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { ClinicService } from '../../../../core/services/clinic.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule],
})
export class AppointmentsComponent implements OnInit {
  loading: any = true;
  today = new Date();
  appointments: any;

  constructor(private clinicService: ClinicService) {}

  ngOnInit() {
    this.fetchAppointments(this.today);
  }

  onDateChange(newDate: Date) {
    this.fetchAppointments(new Date(newDate));
  }

  private fetchAppointments(date: Date) {
    this.loading = true;
    console.log(date);
    console.log(typeof date);

    this.clinicService.getAppointmentsByDate(date).subscribe((res) => {
      this.appointments = res;
      this.loading = false;
    });
  }
}
