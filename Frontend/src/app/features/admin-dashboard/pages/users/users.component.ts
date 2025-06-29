import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncDataHandler } from '../../../../core/models/classes/AsyncDataHandler';
import { IAdmin } from '../../../../core/models/interface/Admin/IAdmin';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { AdminService } from '../../../../core/services/admin.service';
import { UserFormComponent } from "./components/user-form/user-form.component";
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { EmailService } from '../../../../core/services/email.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [CommonModule, DropdownComponent, ModalComponent, UserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  _emailService = inject(EmailService);
  email!: string;
  activeDropdown: string | null = null;
  _asyncDataHandler = new AsyncDataHandler<IAdmin[]>();
  _admins = signal<IAdmin[]>([]);
  activeModal: boolean = false;
  private adminService = inject(AdminService);

  ngOnInit(): void {
    this.getAllAdmin();
  }

  getAllAdmin(): void {
    this._asyncDataHandler.load(this.adminService.getAllAdmin());
    this._asyncDataHandler.data$.pipe(tap(admins => { this._admins.set(admins!), console.log(admins) })).subscribe();
  }
  setActiveDropdown(dropdownId: string): void {
    this.activeDropdown = this.activeDropdown === dropdownId ? null : dropdownId;
  }
  setEmail(email: string): void {
    this.email = email;
  }
  handelCreadeAdmin(isCreaded: boolean) {
    if (isCreaded) {
      this.getAllAdmin();
    }
  }

  deleteAdmin(id: string) {
    this.adminService.deleteAdmin(id).subscribe(response => {
      if (response.statusCode === 200) {
        this._admins.set(this._admins().filter(admin => admin.id !== id));
      }
    });
  }

  handleModalClose($event: string) {
    this.activeModal = false;
  }

}
