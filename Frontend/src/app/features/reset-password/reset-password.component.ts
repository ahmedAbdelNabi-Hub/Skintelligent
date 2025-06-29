import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  email: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        resetOTP: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatch }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  passwordsMatch(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword({
        ResetOTP: this.resetPasswordForm.get('resetOTP')?.value,
        email: this.email,
        password: this.resetPasswordForm.get('newPassword')?.value,
      });
    }
  }
}
