import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../../../../core/services/clinic.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent implements OnInit {
  isLoading = false;
  errorMessage = '';

  constructor(private clinicService: ClinicService, private router: Router) { }

  ngOnInit(): void { }

  pay(accountType: string, price: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (accountType.toLowerCase() === 'basic' || accountType.toLowerCase() === 'pro' || accountType.toLowerCase() === 'enterprise') {
      this.clinicService.upgradeToPro(price,accountType).subscribe({
        next: (res) => {
          window.location.href = res.url;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage =
            err.error?.message || 'Failed to create checkout session.';
        }
      });
    } else {
      this.errorMessage = `Unsupported upgrade: ${accountType}`;
      this.isLoading = false;
    }
  }
}
