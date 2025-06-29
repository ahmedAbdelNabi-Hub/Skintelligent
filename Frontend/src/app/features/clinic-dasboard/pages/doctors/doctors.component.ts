import { ToastService } from './../../../../core/services/toast.service';
import { Doctor } from './../../../../core/types/Doctor';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgToastService } from 'ng-angular-popup';
import { ClinicService } from '../../../../core/services/clinic.service';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { fadeAnimation } from '../../../../core/animations/fadeAnimation';
import { DoctorService } from '../../../../core/services/doctor.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { StarsComponent } from '../../../../shared/components/stars/stars.component';
import { AuthService } from '../../../../core/services/auth.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    LoaderComponent,
    ToastModule,
    ButtonModule,
    MenuModule,
    StarsComponent,
    TooltipModule,
    FormsModule,
  ],
  animations: [fadeAnimation],
})
export class DoctorsComponent implements OnInit {
  dataSource!: MatTableDataSource<Doctor>;
  selection = new SelectionModel<any>(true, []);
  doctors!: Doctor[];
  page: number = 1;
  activeDropdown: string | null = null;
  loading!: boolean;
  subscription: any;
  items!: any[];
  doctorDropdownActions: any[] | undefined;
  selectedDoctor: any;
  filterDropdownActions!: any[];
  searchQuery: string = '';
  searchTimeout: any;
  noDoctorsFound: any;
  filterType: string = '';
  currentFilter: any;
  accountType !: string | null;
  isPremium: boolean = false;

  constructor(
    private dialog: MatDialog,
    private doctorService: DoctorService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllDoctors();
    this.initDoctorDropdownActions();
    this.initFilterDropdownActions();
    this.accountType = this.authService.getAccountType();
    this.isPremium = this.accountType === 'pro' || this.accountType === 'enspire';
  }

  isAllSelected(): boolean {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  onSearchInput(event: Event): void {
    // Clear any existing timeout to implement debounce
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set a timeout to avoid making API calls on every keystroke
    this.searchTimeout = setTimeout(() => {
      this.searchDoctors();
    }, 500); // 500ms debounce
  }

  searchDoctors(): void {
    // Don't search if query is empty or too short
    if (!this.searchQuery || this.searchQuery.trim().length < 2) {
      // If search is cleared, reset to original list
      if (!this.searchQuery || this.searchQuery.trim().length === 0) {
        this.getAllDoctors(); // Assuming this is your method to load all doctors
      }
      return;
    }
  
    if (!this.filterType || this.filterType.length === 0) {
      console.log('filter type is empty');
      this.getAllDoctors(this.searchQuery, '', false);
      return;
    }
  
    console.log(this.filterType);
    this.getAllDoctors(this.searchQuery, this.filterType, false);
  }
  

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  exportToPDF() {
    const doc = new jsPDF();
    const tableElement = document.querySelector('table');
    (doc as any).autoTable({ html: tableElement });
    doc.save('doctors.pdf');
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  showNewDoctorForm() {
    this.dialog
      .open(AddDoctorDialog, {
        width: '550px',
      })
      .afterClosed()
      .subscribe(({ refreshDoctors }) => {
        if (refreshDoctors) {
          this.getAllDoctors();
        }
      });
  }

  onBlockDoctor(doctor: Doctor) {
    this.authService.toggleBlockStatusUser(doctor.id, false).subscribe(
      (response) => {
        this.toast.showSuccess('User blocked successfully!');
        this.getAllDoctors('', '', true); // Refresh the list after deletion
      },
      (error) => {
        this.toast.showError('Failed to block user.');
      }
    );
  }

  initDoctorDropdownActions(isActiveDoctor?: boolean) {
    this.doctorDropdownActions = [
      {
        label: 'Delete',
        icon: 'bx bx-trash bg-red-500 p-1 rounded-md',
        command: () => {
          const doctor = this.selectedDoctor; // Use the doctor input
          this.onDeleteDoctor(doctor);
        },
      },
      isActiveDoctor
        ? {
            label: 'Block',
            icon: 'bx bx-x bg-red-700 p-1 rounded-md',
            command: () => {
              const doctor = this.selectedDoctor; // Use the doctor input
              console.log(doctor);

              this.onBlockDoctor(doctor);
            },
          }
        : {
            label: 'Activate',
            icon: 'bx bxs-bolt-circle bg-green-700 p-1 rounded-md',
            command: () => {
              const doctor = this.selectedDoctor; // Use the doctor input
              console.log(doctor);

              this.onActivateDoctor(doctor);
            },
          },
    ];
  }

  initFilterDropdownActions() {
    this.filterDropdownActions = [
      {
        label: 'Profile Completed',
        icon: 'bx bx-check-circle bg-green-500 p-1 rounded-md',
        command: () => {
          this.applyFilter('completed');
          this.currentFilter = 'completed';
        },
        ...(this.currentFilter === 'completed' && {
          styleClass: 'bg-gray-100',
        }),
      },
      {
        label: 'Profile Not Completed',
        icon: 'bx bx-x-circle bg-yellow-500 p-1 rounded-md',
        command: () => {
          this.applyFilter('not_completed');
          this.currentFilter = 'not_completed';
        },
        ...(this.currentFilter === 'not_completed' && {
          styleClass: 'bg-gray-100',
        }),
      },
      {
        label: 'Newest Created',
        icon: 'bx bx-sort-up bg-blue-500 p-1 rounded-md',
        command: () => {
          this.applyFilter('newest');
          this.currentFilter = 'newest';
        },
        ...(this.currentFilter === 'newest' && { styleClass: 'bg-gray-100' }),
      },
      {
        label: 'Oldest Created',
        icon: 'bx bx-sort-down bg-blue-500 p-1 rounded-md',
        command: () => {
          this.applyFilter('oldest');
          this.currentFilter = 'oldest';
        },
        ...(this.currentFilter === 'oldest' && { styleClass: 'bg-gray-100' }),
      },
      {
        label: 'Highest Rating',
        icon: 'bx bx-sort-a-z bg-purple-500 p-1 rounded-md',
        command: () => {
          this.applyFilter('highest_rating');
          this.currentFilter = 'highest_rating';
        },
        ...(this.currentFilter === 'highest_rating' && {
          styleClass: 'bg-gray-100',
        }),
      },
      {
        label: 'Lowest Rating',
        icon: 'bx bx-sort-z-a bg-purple-500 p-1 rounded-md',
        command: () => {
          this.applyFilter('lowest_rating');
          this.currentFilter = 'lowest_rating';
        },
        ...(this.currentFilter === 'lowest_rating' && {
          styleClass: 'bg-gray-100',
        }),
      },
      {
        label: 'Active',
        icon: 'bx bxs-bolt-circle bg-green-700 p-1 rounded-md',
        command: () => {
          this.applyFilter('active');
          this.currentFilter = 'active';
        },
        ...(this.currentFilter === 'active' && {
          styleClass: 'bg-gray-100',
        }),
      },
      {
        label: 'Blocked',
        icon: 'bx bx-x bg-red-700 p-1 rounded-md',
        command: () => {
          this.applyFilter('blocked');
          this.currentFilter = 'blocked';
        },
        ...(this.currentFilter === 'blocked' && { styleClass: 'bg-gray-100' }),
      },
      {
        label: 'Clear Filter',
        icon: 'bx bx-filter bg-gray-700 p-1 rounded-md',
        command: () => {
          this.applyFilter('');
          this.currentFilter = null;
        },
      },
    ];
  }

  applyFilter(filterType: string) {
    this.filterType = filterType;
    this.getAllDoctors(this.searchQuery, filterType, false);
  }

  onActivateDoctor(doctor: any) {
    this.authService.toggleBlockStatusUser(doctor.id, true).subscribe(
      (response) => {
        this.toast.showSuccess('User activated successfully!');
        this.getAllDoctors('', '', true); // Refresh the list after deletion
      },
      (error) => {
        this.toast.showError('Failed to activate user.');
      }
    );
  }

  onDeleteDoctor(doctor: Doctor) {
    this.doctorService.deleteDoctor(doctor.id).subscribe(
      (response) => {
        this.toast.showSuccess('User deleted successfully!');
        this.getAllDoctors('', '', true); // Refresh the list after deletion
      },
      (error) => {
        this.toast.showError('Failed to delete user.');
      }
    );
  }

  _clinicService = inject(ClinicService);

  getAllDoctors(Search?: string, Filter?: string, dontShowLoader?: boolean) {
    this.loading = !dontShowLoader ? true : false;
    this.subscription = this.doctorService
      .geAllDoctorsByClinicToken({
        pageSize: 10,
        PageIndex: this.page,
        Search,
        Filter,
      })
      .subscribe({
        next: (doctors) => {
          this.doctors = doctors.data;
          this.loading = false;
          console.log(this.doctors);
          this.noDoctorsFound = false;
        },
        error: ({ error }) => {
          console.log(error);

          this.loading = false;
          this.doctors = []; // Set empty array to avoid undefined errors
          if (error.message === 'No doctors found for this clinic.') {
            this.noDoctorsFound = true;
          }
        },
        complete: () => {
          // Optional: Handle completion if needed
        },
      });
  }

  getPage(option: 'next' | 'previous') {
    this.page = option === 'next' ? this.page + 1 : this.page - 1;
    this.getAllDoctors();
  }

  setActiveDropdown(dropdownId: string): void {
    this.activeDropdown =
      this.activeDropdown === dropdownId ? null : dropdownId;
  }

  goToDoctorDetailsPage(doctor: Doctor) {
    // Navigate to doctor details page with the doctor's ID
    this.doctorService.setDoctor(doctor);

    this.router.navigate([`/clinic-dashboard/doctors/${doctor.id}`]);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

@Component({
  selector: 'add-doctor-dialog',
  template: `
    <form class="p-8 w-full" [formGroup]="form">
      <div class="flex flex-col space-y-1">
        <div class="relative flex justify-center items-center">
          <h1
            class="font-bold text-3xl my-2 relative before:absolute before:w-[40px] before:h-[3px] before:left-1/2 before:translate-x-[-50%] before:bg-blue-700 before:rounded-lg before:-bottom-2 text-center"
          >
            Create a new doctor account
          </h1>
        </div>
        <div class="small-input mb-4">
          <label class="font-bold"> First name</label>
          <input
            type="text"
            formControlName="firstName"
            placeholder="Ex. Alex"
          />
          <p
            class="text-red-500"
            *ngIf="
              firstName?.hasError('maxlength') ||
              firstName?.hasError('minlength')
            "
          >
            a first name between 5 to 20 characters
          </p>
          <p
            class="text-red-500"
            *ngIf="firstName?.hasError('required') && firstName?.touched"
          >
            first name is <strong>required</strong>
          </p>
        </div>
        <div class="small-input mb-4">
          <label class="font-bold"> Last name</label>
          <input
            type="text"
            formControlName="lastName"
            placeholder="Ex. Alex"
          />
          <p
            class="text-red-500"
            *ngIf="
              lastName?.hasError('maxlength') || lastName?.hasError('minlength')
            "
          >
            a last name between 5 to 20 characters
          </p>
          <p
            class="text-red-500"
            *ngIf="lastName?.hasError('required') && lastName?.touched"
          >
            last name is <strong>required</strong>
          </p>
        </div>
        <div class="small-input mb-4">
          <label class="font-bold"> Email</label>
          <input
            type="email"
            formControlName="email"
            placeholder="Ex. pat@example.com"
          />
          <p
            class="text-red-500"
            *ngIf="email?.hasError('email') && !email?.hasError('required')"
          >
            Please enter a valid email address
          </p>
          <p
            class="text-red-500"
            *ngIf="email?.touched && email?.hasError('required')"
          >
            Email is <strong>required</strong>
          </p>
        </div>
        <div class="small-input mb-4">
          <label class="font-bold">Password</label>
          <input
            type="password"
            formControlName="password"
            placeholder="Ex. 25Kl*ndR"
          />
          <p
            class="text-red-500"
            *ngIf="password?.touched && password?.hasError('minlength')"
          >
            Must be at least 5 charaters
          </p>
          <p
            class="text-red-500"
            *ngIf="password?.touched && password?.hasError('required')"
          >
            Password is <strong>required</strong>
          </p>
        </div>
        <div class="small-input mb-4">
          <label class="font-bold">Confirm password</label>
          <input
            type="password"
            formControlName="confirmPassword"
            placeholder="Ex. 25Kl*ndR"
          />
          <p
            class="text-red-500"
            *ngIf="
              confirmPassword?.touched &&
              confirmPassword?.hasError('notIdentical')
            "
          >
            Must be Identical
          </p>
          <p
            class="text-red-500"
            *ngIf="
              confirmPassword?.touched && confirmPassword?.hasError('required')
            "
          >
            Confirm password is <strong>required</strong>
          </p>
        </div>
        <button
          class="w-full bg-blue-700 text-white py-3 mt-4 rounded-lg hover:bg-blue-800 transition cursor-pointer"
          id="signInBtn"
          (click)="createDoctorAccount()"
        >
          Create
        </button>
      </div>
    </form>
  `,
  styles: `
  .small-input input {
  border: 1px solid gainsboro;
  padding: 0.5rem;
  padding-left: 0.8rem;
  border-radius: 0.5rem;
  width: 100%;
}`,
  imports: [MatButtonModule, ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDoctorDialog {
  readonly dialogRef = inject(MatDialogRef<AddDoctorDialog>);
  form: any;
  constructor(
    private fb: FormBuilder,
    public toast: NgToastService,
    private doctorService: DoctorService
  ) {
    this.form = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(3),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(3),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  createDoctorAccount() {
    this.doctorService.createDoctorAccount(this.form.value).subscribe((res) => {
      this.toast.success(res.message);
      this.dialogRef.close({
        refreshDoctors: true,
      });
    });
  }
  /* Form Getters */
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}
