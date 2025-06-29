import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  public title = 'Settings';
  form!: FormGroup;
  changePasswordForm !: FormGroup;
  private toasteService = inject(ToastService);
  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: [this.passwordMatchValidator] })
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]]
    });
  }

  passwordMatchValidator(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.form.valid) {
      this.adminService.update(this.form.value).subscribe((res) => {
        this.toasteService.showSuccess('Update successfully');
      })
    } else {
      this.form.markAllAsTouched();
    }
  }
  submitPassword() {
    if (this.changePasswordForm.valid) {
      this.adminService.changePassword({
        oldPassword: this.changePasswordForm.get('oldPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value
      }).subscribe((res) => {
        this.toasteService.showSuccess('Change password successfully');
      })
      console.log(this.changePasswordForm.value);
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  get f() { return this.form.controls; }
}
