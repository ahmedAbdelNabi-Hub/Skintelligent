import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class StarsComponent implements OnInit {
  @Input({ required: true }) rating: number = 0; // Input property for the rating value
  constructor() {}

  ngOnInit() {}

  getStarArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
}
