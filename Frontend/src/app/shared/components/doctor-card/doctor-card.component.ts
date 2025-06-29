import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { StarsComponent } from '../stars/stars.component';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.css'],
  standalone: true,
  imports: [CommonModule, StarsComponent],
})
export class DoctorCardComponent implements OnInit {
  @Input() doctor!: any;

  constructor(private router: Router, private doctorService: DoctorService) {}

  ngOnInit(): void {}

  seeReviews(doctor: any) {
    this.doctorService.setDoctor(doctor);
    this.router.navigate([`/clinic-dashboard/feedback/${doctor.id}`]);
  }
}
