import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class VerifyAccountComponent implements OnInit {
  otp: string = '';
  email: string = '';
  countdown: number = 59;
  isResendDisabled: boolean = true;

  constructor(
    private authService: AuthService,
    private toast: NgToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.startCountdown();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  startCountdown() {
    const interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.isResendDisabled = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  resendCode() {
    this.countdown = 59;
    this.isResendDisabled = true;
    this.startCountdown();
    alert('OTP Resent!');
  }

  verifyAccount() {
    this.authService.confirmEmail(this.otp, this.email).subscribe({
      next: (res) => {
        this.toast.success('Account Verified Successfully');
        this.router.navigate(['/account-review']);
      },
      error: (err) => {
        this.toast.danger('Invalid OTP');
      },
    });
  }
}
