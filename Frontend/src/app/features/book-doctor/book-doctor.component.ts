import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../core/services/doctor.service';
import { AppointmentsCalendarComponent } from '../../shared/components/appointments-calendar/appointments-calendar.component';
import { StarsComponent } from '../../shared/components/stars/stars.component';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { AppointmentService } from '../../core/services/appointment.service';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../core/services/toast.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    AppointmentsCalendarComponent,
    StarsComponent,
    DatePickerModule,
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    ToastModule,
    ToastComponent,
  ],
  templateUrl: './book-doctor.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class BookDoctorComponent implements OnInit {
  isSelectedAppointmentBooked: boolean = false;
  bookAppointment() {
    this.appointmentService
      .bookAppointment({ appointmentId: this.selectedAppointment.id })
      .subscribe({
        next: (response) => {
          console.log('Appointment booked successfully:', response);
          this.toast.showSuccess('Appointment booked successfully!');
          this.selectedAppointment = null;
          this.isSelectedAppointmentBooked = true;
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          this.toast.showError('Error booking appointment!');
        },
      });
  }
  doctor: any = null;
  selectedDate: Date = new Date();
  selectedClinicIndex: number = 0;
  justifyOptions: any[] = [];
  selectedClinic: any = null;
  clinics: any;
  selectedAppointment: any;

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.doctor = this.doctorService.getDoctor();
    this.getClinicsForDoctor();
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
  }

  getClinicsForDoctor() {
    this.doctorService.getClinicsByDoctorId(this.doctor.id, 1, 10).subscribe({
      next: (response) => {
        this.doctorService.setClinic(response.data[0]);
        const mockClinicImages = [
          'https://img.freepik.com/premium-vector/medical-clinic-logo_786241-344.jpg',
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAAC8CAMAAAC672BgAAAAz1BMVEX///8AM5mbzwCXzQAAG5IAH5MAKpfO1urc4vAAMZi7w95dcrMAIZQAL5gALJdgeLgAJ5UAFJEAJJQAHJP3+Pvu8fj///yyvdu121hVbbL3++vf77nz+eIAF5Gf0QDy9fuo1S12iL+Kmsnv99rS6Jvb7a/O5pLi8b6v2FTF4388Wqr7/fTH0OWu2Dzq9dHz+eUxUaaaqNADOZ3u99ams9ZFXasRRqWBk8a53GS/4HRNZa4AAIxqf7vK5IjU6aOv2Unt+cugrNLt7v8pSqPa3vXVFQudAAALdElEQVR4nO2deX+iPBDHjQiCAkXEelSs2m67tdZV69XWXtu+/9f0gBBIODRY1LBPvn/th2vJr8lkZjLEXI7BYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDEbu8fb81K/wIwyxVK8PRePHD7r/1eC67RTe6CRcirPefDFflsQUHna74jjuKYUHnYLi5Bm8CL1hLZWnXTxwXJ67TuVZR8YorRXzRekVU3reoy1FnrtI6XHHpNhTCnJhXv+5lXA4f7WlyHO3KT3veBizMa8JlWaCTtG6eFqt7m7vY063u7YUee4jjdc7Jpd9RVZUvpnAYraeOJfXSDkuuGxqUevruiTxg2GCe0b5TVs37c1fhc9fO6e5X6m95XGYTHUANGGW5J4PT4poNW5cLW7Se81jMFzIClD48mWSm1p5DK4bGClQi1Wab3pwamcVBQAB1JPdtuICarxip+EY6WbKB69PNQAAP0/oYf0JaGGBNvvWPc1F2BJqMc4KVreQqsukN76FxEAdqzbU4i3Nlz0w4sIynEDREw6RXHiUYJbyvOsOkvc0X/bAzDTV1kJJMqG6/A6L4ZvKpwwOkn5BsrRQp/tEptvEgJMud5fiyx6YsyqwtVjsFZxuGSbnHfdIJ85Np49n+QdawKkzyoC+wo6RmbDdGNgzKlCmeyYtrsJiuP2g7Z3JSscwxo4W6t6ZrEbQ6YIGAg6g7PjhTr+Q5Mh5pDW6vb5bNX6/2/xurJ5ubkehBGYbF4PrtJzjXpfhstIxmrZ7AUA1FJm1Lm7e81wU+YfXX3/QSy8wNbiRexj2mMwkPdcb2wnkHnrwvP226uDtx//2Fp0nRJALJITvQC0evY7xeMwW7c+ksNFCGKAHW7cXo3b7j8PjxfXr00MnUpH3G+hKtRtQtqcWfAz0t/LdY7Zof0qmtDEYyk7jaQ2ah3yEHt1rt/Htt8bDw+qt5d/hXZUN8ykqyqZj8LsCkqLe7Jf+3n/cPQT1sARpRK+Pee5HRjzxgeoMkuauC4umqleF+XKYe3zthPuH1z1QuvB8NvIYSx44HWOnt1UsbAaTxoP1MPfRCHeP/N2fwC0jr2NkYi4ZVlwtPndeWnTsrCWIYE4nf9t3+fBoecL9jztPjCysGhlfjsFQxruv9cTYpDyE9XfrLsJ4YHJ0vONZWGXuy27HKO2+FhXDQpPLYmsVIced52qO/JOHbERKiJsMhhWrzgkuDohhjZbK+u/oIRyhcdeutfRHSRZSXM/OTAIqJEuIQTHs3qFOcm+hzpHnus5iqidUFryMkts8oo4RJQaQ+PF36z2iczRaaMY8C6toY8d6gipR0jNKDMuUVpYRmR17rOR++WJ8HLglP6fuuhgkU0kuTgwrvht8f3Qi5Hj3Uxxc0AGhD9gx5N0+hk2cGECtivfhoYIGMRz1/mfJdMe9QpbqixUDmEVk5oiEejFgxxDOyK6PF6NgT0YRhsOjQ7sYxarblCqBw7W5YbsYgVQXBvVh2lpwm6IT3rBLDLRaJSjGwVqRDrWp5I6SNeEdO8XIPcap0T1UK1Ji5s6ru5M6kN1i5K5i1OgeqBFpAT1xSSNdNiIQI9eOVoNyA1qruqNEIXLFbUjEsPpGBsWYubE70Hq7L3YgEsNfG8CgWww4SogyGQ5kYuBVfy6Ur6bpEjQZxKurhGJEVDRRnhsvwrlEmhLXhZOKEeGZ010sPtHddhBGrDbEYuRCURvd+YwmNBmhwGRYisMTMIQ+wS4ctkI9g+YqP5gUt9rRD5xqVvgYYrWwnoJd+FL8FegagQpZuhCh/QRy0P8sC/FtJkSZBku8qC6SHsKINTyzpiAG0HvBSnKas+P+8A/avlTEkOTvG7xrdE/RSkJ6GnxvM+hmpCGGnW7vYGJ0TtJMMrzJBFSCYVoqYgCzhNtQ7iTNJANm/A4mhvLlVyNQLoYB4GQCKsEvbNIRA1TxrkFxcGJUDy6GOj9HrQYXUchCCbWK99IHGiZA4r/REIXikgTR9F76MLMJsPMkV0wMiKTkkGoFisVA4s/QmnNaYoBC6SZrYhwiNnEQ1ldZE0MPlounJoYEzrtZEAOxGaF8cHpiyN+rLNQk1Hwx1OfAudTEAPLMz4ZS7GcYvp+hLALn0hNDWPvVfhQXaBiy54GCYHFGemKo83YWYpPc1BeDDyQ00hNDWVxmIoQfeFErkCf4qfTEAOpfOJ1w3ZM0k4wzL58RSo+nKEb1L1wzCKT90trCJx2WXqbL6sz4q6UohunNrfhHBWns9ZUin7L/ygX83dLsGUPvI3hs3YR4dfc4oItjOm40yoIUR3yzo6+vlmAUj6+oJdq95vDUfAMaXGBsykIMaqwakhp5Q6Xk9Qz008UiZT0DSYIG8ztiLHU5Tgy5Hn2H4dkM1OdaprMtXnqcIZYhME5iIV949oAF0130IPlS95GYIX9l5Yvsnj3EcNM72GQyJK0uPBoiIoYkk21Yt4cY0OdCN4tYJ9/D5tAoiDUkLOtKLgZccUXt56VJm8lAFxjt76uI3i+5GF7UiqyaTKgzGf5HSBtCRRqRJBfDzWdwDeSYSvR/HRcD9RokgSRaSC7GKry1Yf2FMmd8wxp1u4m6RmIxYA4UTXMtKBwlaL2K3TUkgk0NE4txFd6qbPZC6NQcF7+sa9M1CPavSywG3OjR//TbWFA4l9j0sYI1efdQTixGJ5Tl6ps792I4DTUeDbxCWfIwScVw66YRj0s0K3vslHcUzrDMhbnTMUwqBgxMfCfjWaPSfNogS0mA5BvGhGJchTrGjCf+0Of44Ektrbzj8oRiwPDdi95FVf2iK/uJUpSxdE14l67A5YnEcL87QUroBypPWY4LA7caUqhWAyeZGE70jgTvSzm0ekcVYhXrGspiq+uVSAwnLEH2mK5XJZO2fB/OEi+O17Z6AUnEcBcW/Y9uREEimL1PijFVsFbJ27JQCcQ4dweJZzBqigJ0GkM0lBKPN8vcErElEMPJivvR6uWXSpgnOCllDW8XHx9IkYvhBCV+TGLMtXDtA4XUBHw1RCrEqkEsxsZ4cnm48eNmF1rJTOvnYg5JycQbJlXi1Ej09SL37iUxLu2dV3n6B4lNL7A2FLsdfbESt9T2goph76PBIdsv1ewdeQXi76pPzEANqMFHO+Zi8ywG9Bdh7jhLit9+cZ8oqfbexHSmMcLUJHx+BUAf7PvurXd7u9QP/0Bdtn/7gKc1cg8zLASXlIXpfm9/Ye/QNUIOLDdJkwLZDkd0UK8G1VAKexi8VoPrvKIFn7XBJhTMiPGETEIThcQPEjqM96+dpxF2ZCZsrBFP3eLqDvpmUA2gakkS2fe31yO81rPWdEafvCtPQh/90EgBkvxFbjnOg1Wvfd3JD8iUpoC30g9ZUXvfviQ/o4ZSn7qJo5hpmnYmlYgyJUE/20OO+ph3Z+tC1uwFZOMShMaKICf5vUEL43MBpZD2mZMooQjUsBr2hrDjGbETJi41KAVQQh+zZInaOLqGTeGVcp1AD3EyqGreYBOmWQhUt9ArRAwVu3uovDD/3NY4o7Rc6Lp/t8Q/J/qFPhqpAy1SDVsP3dSa/bpYCyx+XNaKs97YrGpoaVQyL4VWamUzunO4beQL0tdzubfsTz4/J/3lujlfaAVZw++R+DHtCU9C6pK+pTLaXohUVUHTbTRNUBUleLUkkJaWZgBjqf+kml6tlrOSvSBCLJvxleLbUcxEv3ibCcTnqpBcDmvSGdO9bLYn4lrQt5jSKCk0+fmf6xWQWn9hEncP2xPp/SNTSAzDM4EXQtNFCEWV5efUfj2eXozS+ouXhfgBo6h6dUHkrf8TGOLn+susypqq+F9nWf9QVE3nK9PypJh5xzshl8PZ8nlhOVuyg64J03nvs/R/6RFRXIpi0UYU/88qMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBuNf4T/VIdgydoxUlgAAAABJRU5ErkJggg==',
        ];
        this.clinics = response.data.map((clinic: any, index: number) => ({
          ...clinic,
          image: mockClinicImages[index],
        }));
        this.justifyOptions = this.clinics.map(
          (clinic: any, index: number) => ({
            justify: clinic.clinicName,
            icon: 'bx bx-customize',
            value: index,
            image: clinic.image,
          })
        );
      },
      error: (error) => {
        console.error('Error fetching clinics:', error);
      },
    });
  }
}
