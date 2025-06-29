import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { config } from '../../../environments/config';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    RouterLink,
    LoaderComponent,
  ],
})
export class SignInComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);
  loading: boolean = false;
  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  proceedSignIn() {
    if (!this.email.errors && !this.password.errors) {
      this.loading = true;
      this.authService
        .login(this.email.value!, this.password.value!)
        .pipe(
          takeUntil(this.destroy$),
          tap((res: any) => {
            localStorage.setItem('token', res.token);
            this.loading = false;
            this.authService
              .getCurrentUser(res.token)
              .pipe(
                tap((res) => {
                  this.toast.success('Logged in successfully!');
                  localStorage.setItem('user', JSON.stringify(res));
                  this.router.navigate(['/redirect']);
                })
              )
              .subscribe();
          }),
          catchError((err) => {
            this.toast.danger(err.error.message);
            this.loading = false;
            return of('');
          })
        )
        .subscribe();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
