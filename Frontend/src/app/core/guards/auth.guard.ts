import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/signin']); // Redirect if not logged in
      return false;
    }
    try {
      const user = JSON.parse(userData);
      const role = user?.roles?.[0];

      switch (role) {
        case 'clinic':
          this.router.navigate(['/clinic-dashboard']);
          break;
        case 'admin':
          this.router.navigate(['/admin-dashboard']);
          break;
        case 'patient':
          this.router.navigate(['/patient-dashboard']);
          break;
        case 'doctor':
          this.router.navigate(['/doctor-dashboard']);
          break;
        default:
          this.router.navigate(['/signin']);
          break;
      }
    } catch (error) {
      this.router.navigate(['/signin']);
    }

    return false; // Prevent navigation to the original route
  }
}
