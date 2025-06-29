import { Component, OnInit, OnDestroy } from '@angular/core';
import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ChatGroupComponent } from "../../../../shared/components/chat-group/chat-group.component";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  standalone: true,
  imports: [DoctorCardComponent, CommonModule, LoaderComponent, ChatGroupComponent],
})
export class FeedbackComponent implements OnInit, OnDestroy {
  doctors!: any[];
  loading: any;
  private subscription: any; // Add a subscription property

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.getDoctors();
  }

  getDoctors() {
    this.loading = true;
    this.subscription = this.doctorService
      .geAllDoctorsByClinicToken({
        pageSize: 10,
        PageIndex: 1,
      })
      .subscribe((res) => {
        this.loading = false;
        this.doctors = res.data;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
