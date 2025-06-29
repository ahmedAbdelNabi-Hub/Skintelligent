import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../../../core/services/doctor.service';
import { Doctor } from '../../../../../core/types/Doctor';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { StarsComponent } from '../../../../../shared/components/stars/stars.component';
import { fadeAnimation } from '../../../../../core/animations/fadeAnimation';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss'],
  standalone: true,
  imports: [CommonModule, LoaderComponent, StarsComponent],
  animations: [fadeAnimation],
})
export class DoctorDetailsComponent implements OnInit {
  doctorId: string = '';
  doctor: any | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.doctorId = params['id'];
      this.loadDoctorDetails();
    });
  }

  loadDoctorDetails(): void {
    this.doctor = this.doctorService.getDoctor();
    this.loading = false;
  }

  goBack(): void {
    this.router.navigate(['/clinic-dashboard/doctors']);
  }
}
