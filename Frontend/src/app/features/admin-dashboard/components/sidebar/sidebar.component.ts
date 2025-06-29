import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  ClinicDTO,
  DoctorService,
} from '../../../../core/services/doctor.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          height: '0',
          opacity: 0,
        })
      ),
      transition('in => out', [animate('100ms ease-out')]),
      transition('out => in', [animate('100ms ease-in')]),
    ]),
  ],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input({ required: true }) menuItems!: any[];
  @Input() doctor!: boolean;
  @Input() showSidebar: boolean = true;
  @Output() onToggleSidebar: any = new EventEmitter();
  clinics: ClinicDTO[] = [];
  isAccordionOpen: boolean = true;
  role: any;

  constructor(private doctorService: DoctorService , private authService: AuthService) { }

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('user') || '{}')?.roles?.[0];
    if (this.doctor) {
      this.getClinicsForDoctor();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctor'] && !changes['doctor'].firstChange) {
      this.getClinicsForDoctor();
    }
  }

  getClinicsForDoctor() {
    this.doctorService.getClinicsByDoctorId(0, 1, 10).subscribe({
      next: (response) => {
        this.clinics = response.data;
        this.doctorService.setClinic(response.data[0]);
      },
      error: (error) => {
        console.error('Error fetching clinics:', error);
      },
    });
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  selectClinic(clinic: ClinicDTO) {
    this.doctorService.setClinic(clinic);
  }
  logout():void{
    this.authService.logout();  
  }
}
