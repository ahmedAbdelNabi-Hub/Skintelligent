import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleAccessGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role']; // e.g., 'admin', 'clinic', etc.
    const userData = localStorage.getItem('user');

    if (!userData) {
      this.router.navigate(['/signin']);
      return false;
    }

    const user = JSON.parse(userData);
    const role = user?.roles?.[0];

    if (role === expectedRole) {
      return true;
    }
    switch (role) {
      case 'clinic':
        this.router.navigate(['/clinic-dashboard']);
        break;
      case 'doctor':
        this.router.navigate(['/doctor-dashboard']);
        break;
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'patient':
        this.router.navigate(['/']);
        break;
    }
    return false;
  }
}
