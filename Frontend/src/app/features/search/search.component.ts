import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule, NgIfContext } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { StarsComponent } from '../../shared/components/stars/stars.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    CalendarModule,
    DropdownModule,
    StarsComponent,
    FooterComponent,
  ],
})
export class SearchComponent implements OnInit {
  page: number = 1;
  searchCriteria = {
    specialty: '',
    city: '',
    area: '',
    insurance: '',
    name: '',
  };
  allDoctors: any[] = []; // To store the original list of doctors
  doctors: any[] = [];
  expandedDoctorId: number | null = null;
  selectedDate: any;
  selectedTime: any;
  timeOptions: any[] = [];
  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllDoctors(); // Load all doctors initially
    // Initialize allDoctors with a copy of doctors for filtering
    this.allDoctors = [...this.doctors];
    this.initTimeOptions();
    window.scrollTo(0, 0);
  }

  initTimeOptions(): void {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour % 12 === 0 ? 12 : hour % 12}:${minute
          .toString()
          .padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
        this.timeOptions.push({ label: timeString, value: timeString });
      }
    }
  }

  bookAppointment(doctor: any) {
    this.router.navigate(['/book-appointment']);
    this.doctorService.setDoctor(doctor);
  }

  loadAllDoctors(): void {
    this.doctorService
      .getAllDoctors({
        pageSize: 10,
        PageIndex: this.page,
      })
      .subscribe((res) => {
        this.doctors = res.data;
      });
  }

  onSearch(): void {
    let filteredDoctors = [...this.allDoctors];

    if (this.searchCriteria.name) {
      const searchTermName = this.searchCriteria.name.toLowerCase();
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTermName) ||
          (doctor.clinicName &&
            doctor.clinicName.toLowerCase().includes(searchTermName))
      );
    }

    if (this.searchCriteria.specialty) {
      const searchTermSpecialty = this.searchCriteria.specialty.toLowerCase();
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          (doctor.specialty &&
            doctor.specialty.toLowerCase().includes(searchTermSpecialty)) ||
          (doctor.specialtyDescription &&
            doctor.specialtyDescription
              .toLowerCase()
              .includes(searchTermSpecialty)) ||
          (doctor.detailedSpecialties &&
            doctor.detailedSpecialties
              .toLowerCase()
              .includes(searchTermSpecialty))
      );
    }

    if (this.searchCriteria.city) {
      const searchTermCity = this.searchCriteria.city.toLowerCase();
      // Assuming doctor.location or doctor.clinicAddress might contain city information
      // This logic might need adjustment based on the actual data structure for city/area
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          (doctor.location &&
            doctor.location.toLowerCase().includes(searchTermCity)) ||
          (doctor.clinicAddress &&
            doctor.clinicAddress.toLowerCase().includes(searchTermCity))
      );
    }

    if (this.searchCriteria.area) {
      const searchTermArea = this.searchCriteria.area.toLowerCase();
      // Assuming doctor.location or doctor.clinicAddress might contain area information
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          (doctor.location &&
            doctor.location.toLowerCase().includes(searchTermArea)) ||
          (doctor.clinicAddress &&
            doctor.clinicAddress.toLowerCase().includes(searchTermArea))
      );
    }

    // Insurance filtering would require a specific field in the doctor object for insurance plans.
    // For now, this is a placeholder if you add an 'insurancePlans' array or similar to your doctor data.
    // if (this.searchCriteria.insurance) {
    //   const searchTermInsurance = this.searchCriteria.insurance.toLowerCase();
    //   filteredDoctors = filteredDoctors.filter(doctor =>
    //     doctor.insurancePlans && doctor.insurancePlans.some(plan => plan.toLowerCase().includes(searchTermInsurance))
    //   );
    // }

    this.doctors = filteredDoctors;
  }

  toggleDoctorAvailability(doctorId: number): void {
    this.expandedDoctorId =
      this.expandedDoctorId === doctorId ? null : doctorId;
  }
}
