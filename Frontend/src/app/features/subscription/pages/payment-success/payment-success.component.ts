import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IBaseApiResponse } from '../../../../core/models/interface/IBaseApiResponse';
import { ClinicService } from '../../../../core/services/clinic.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  message = '';
  loading = true;
  time = new Date();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clinicService: ClinicService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    const accountType = this.route.snapshot.queryParamMap.get('accountType');
    console.log(sessionId, accountType);
    if (sessionId && accountType) {
      this.clinicService.confirmPayment(sessionId, accountType).subscribe({
        next: (res: IBaseApiResponse) => {
          this.toastService.showSuccess(res.message);
          this.message = res.message;
          this.loading = false;
        },
        error: (err) => {
          this.toastService.showError(err?.error?.message || 'Payment confirmation failed.');
          this.message = err?.error?.message || 'Payment confirmation failed.';
          this.loading = false;
        }
      });
    } else {
      this.message = 'Missing session ID or account type in the URL.';
      this.loading = false;
    }
  }


  goToDashboard(): void {
    this.router.navigate(['/clinic-dashboard']);
  }
}
