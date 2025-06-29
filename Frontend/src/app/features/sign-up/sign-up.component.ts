import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import Aos from 'aos';
import { AuthService } from '../../core/services/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

Aos.init();

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    HttpClientModule,
    RouterLink,
    NgToastModule,
    LoaderComponent,
  ],
})
export class SignUpComponent implements OnInit {
  loading = false;
  selectedFile: File | null = null;
  form: FormGroup;
  @ViewChild('checkbox') check!: any;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      clinicName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      contactNumber: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
  
      // Optional: Basic image type validation
      if (!file.type.startsWith('image/')) {
        this.toast.warning('Only image files are allowed.');
        return;
      }
  
      this.selectedFile = file;
  
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  proceedSignUp(): void {
    if (!this.form.valid) {
      this.toast.warning('Please fill out the form correctly.');
      this.form.markAllAsTouched();
      return;
    }
    if (!this.selectedFile) {
      this.toast.warning('Please select a file.');
      return;
    }
    this.loading = true;

    const formData = this.getFormData();
    this.authService.registerUser('clinic', formData).subscribe({
      next: () => {
        this.toast.success('Account created successfully', '', 3000);
        setTimeout(() => {
          this.router.navigate(['/verify-account'], {
            queryParams: { email: this.email?.value },
          });
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.toast.danger(err.error?.message || 'Something went wrong.', '', 6000);
      }
    });
  }

  getFormData(): FormData {
    const formData = new FormData();
    const controls = this.form.controls;

    formData.append('clinicName', controls['clinicName'].value);
    formData.append('contactNumber', controls['contactNumber'].value);
    formData.append('address', controls['address'].value);
    formData.append('email', controls['email'].value);
    formData.append('password', controls['password'].value);
    formData.append('confirmPassword', controls['confirmPassword'].value);

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile, this.selectedFile.name);
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    return formData;
  }

  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Getters for cleaner template access
  get clinicName() { return this.form.get('clinicName'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
  get address() { return this.form.get('address'); }
  get contactNumber() { return this.form.get('contactNumber'); }
}
