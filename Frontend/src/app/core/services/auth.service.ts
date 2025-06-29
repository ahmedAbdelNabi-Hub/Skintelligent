import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../../environments/config';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService
  ) { }

  registerUser(
    userType: 'clinic' | 'patient' | 'doctor',
    userData: FormData
  ): Observable<any> {
    return this.http.post(`${config.API_Test_Localhost}/api/auth/clinic/register`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${config.API_Test_Localhost}/api/auth/login`, {
      email,
      password,
    });
  }

  getCurrentUser(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(
      `${config.API_Test_Localhost}/api/auth/current-user`,
      {
        headers,
      }
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${config.API_URL}/api/auth/forgot-password`, {
      email,
    });
  }

  confirmEmail(otp: string, email: string): Observable<any> {
    return this.http.post(
      `${config.API_Test_Localhost}/api/auth/confirm-email`,
      {
        OtpCode: otp,
        email,
      }
    );
  }

  sendForgotPasswordRequest(email: string): void {
    this.http
      .post(`${config.API_URL}/api/auth/forgot-password`, { email })
      .subscribe(
        (response) => {
          console.log('Reset link sent', response);
          this.router.navigate(['/reset-password'], {
            queryParams: { email },
          });
        },
        (error) => {
          console.error('Error sending reset link', error);
        }
      );
  }

  resetPassword(resetPasswordForm: any): void {
    this.http
      .post(`${config.API_URL}/api/auth/reset-password`, {
        email: resetPasswordForm.email,
        password: resetPasswordForm.password,
        ResetOTP: resetPasswordForm.ResetOTP.toString(),
      })
      .subscribe(
        (response) => {
          this.toast.success('Password reset successful!');
          this.router.navigate(['/login']);
        },
        (error) => {
          this.toast.danger(error.error.message);
        }
      );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${config.API_Test_Localhost}/api/user/${userId}`, {
      params: {
        TypeUser: 'Doctor',
      },
    });
  }

  toggleBlockStatusUser(userId: string, status: boolean) {
    return this.http.patch(
      `${config.API_Test_Localhost}/api/doctors/${userId}/block-status`,
      status,
      {}
    );
  }

  private getUserFromLocalStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string[]  {
    const user = this.getUserFromLocalStorage();
    return user.roles ;
  }

  getAccountType(): string | null {
    const user = this.getUserFromLocalStorage();
    return user?.subscription?.accountType ?? null;
  }

  getClinicId(): number {
    const user = this.getUserFromLocalStorage();
    return user.subscription?.id;
  }

  getUserEmail(): string | null {
    const user = this.getUserFromLocalStorage();
    return user ? user.email : null;
  }

  getUserId(): string | null {
    const user = this.getUserFromLocalStorage();
    return user ? user.id : null;
  }
  getUsername(): string | null {
    const user = this.getUserFromLocalStorage();
    return user ? user.username : null;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }
}
