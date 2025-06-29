import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userData = localStorage.getItem('user');

    if (!userData) {
      return true; // Not logged in → allow access
    }

    try {
      const user = JSON.parse(userData);
      const role = user?.roles?.[0];

      // Already logged in → redirect based on role
      switch (role) {
        case 'admin':
          this.router.navigate(['/admin-dashboard']);
          break;
        case 'clinic':
          this.router.navigate(['/clinic-dashboard']);
          break;
        case 'doctor':
          this.router.navigate(['/doctor-dashboard']);
          break;
        case 'patient':
          this.router.navigate(['/search']);
          break;
        default:
          this.router.navigate(['/']);
      }

      return false;
    } catch {
      return true;
    }
  }
}
