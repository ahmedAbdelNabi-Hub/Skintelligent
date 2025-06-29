import { Component, OnInit } from '@angular/core';
import { DoctorReviewsComponent } from '../../../../../../shared/components/doctor-reviews/doctor-reviews.component';
import { DoctorService } from '../../../../../../core/services/doctor.service';

@Component({
  selector: 'app-feedback-details',
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.css'],
  standalone: true,
  imports: [DoctorReviewsComponent],
})
export class FeedbackDetailsComponent implements OnInit {
  page: number = 0;
  doctor!: any;
  reviews: any[] = [];
  totalReviews: any;
  hideViewMoreReviewBtn: boolean = false;

  constructor(private doctorService: DoctorService) {
    this.doctor = this.doctorService.getDoctor();
    console.log(this.doctor);
  }

  ngOnInit() {
    setTimeout(() => {
      this.getReviews();
    }, 1000);
  }

  getReviews() {
    if (this.totalReviews === this.reviews.length) {
      this.hideViewMoreReviewBtn = true;
      return;
    }
    this.page = this.page + 1;
    this.doctorService
      .getDoctorReviews(this.doctor.id, {
        pageSize: 3,
        PageIndex: this.page,
      })
      .subscribe((res) => {
        this.reviews = [...this.reviews, ...res.data];
        console.log(this.reviews);
        this.totalReviews = res.count;
      });
  }
}
