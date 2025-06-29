import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../../../core/services/admin.service';
import { ToastService } from '../../../../../../core/services/toast.service';
import { AsyncDataHandler } from '../../../../../../core/models/classes/AsyncDataHandler';
import { IBaseApiResponse } from '../../../../../../core/models/interface/IBaseApiResponse';
import { delay, tap } from 'rxjs';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() isCreaded = new EventEmitter<boolean>();

  userForm: FormGroup;
  submitted = false;
  private _toast = inject(ToastService);
  private adminService = inject(AdminService);
  _asyncDataHandler = new AsyncDataHandler<IBaseApiResponse>();


  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]]
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this._asyncDataHandler.load(this.adminService.createAdmin(this.userForm.value).pipe(
      delay(1000),
      tap(response => {
        if (response?.statusCode == 200) {
          this.closeModal();
          this._toast.showSuccess(response.message);
          this.isCreaded.emit(true);
          this.userForm.reset()
        }
        else
          this._toast.showError(response?.message!);
      })
    ));
  }


  closeModal() {
    this.closeModalEvent.emit('Modal closed successfully!'); // Send a message when closing
  }
}
