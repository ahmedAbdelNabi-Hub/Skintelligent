import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  selectedPlan: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedPlan = params['plan'] || 'basic';
    });
  }

  getPlanPrice(plan: string): string {
    switch (plan) {
      case 'Basic':
        return '$0.00';
      case 'Pro':
        return '$10.00';
      case 'Enterprise':
        return '$20.00';
      default:
        return '$0.00';
    }
  }
}
