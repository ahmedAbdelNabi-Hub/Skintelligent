import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StarsComponent } from '../stars/stars.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-doctor-reviews',
  templateUrl: './doctor-reviews.component.html',
  styleUrls: ['./doctor-reviews.component.css'],
  standalone: true,
  imports: [StarsComponent, CommonModule, LoaderComponent],
})
export class DoctorReviewsComponent implements OnInit {
  @Output() onViewMoreReviewsClicked = new EventEmitter();
  @Input() reviews: any[] = [];
  @Input() totalReviews: number = 0;
  @Input() hideViewMoreReviewBtn: boolean = false;
  @Input() avgRating: number = 0;
  constructor() {}

  ngOnInit() {}
}
