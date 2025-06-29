import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DoctorService } from '../../core/services/doctor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
})
export class HomeComponent implements OnInit {
  private route = inject(Router);
  private authService = inject(AuthService);
  videoSources: string[] = [
    '../../../assets/ori.mp4',
    '../../../assets/original-cb1207d183364c4dacf5974c0ea6a9c6.mp4',
    '../../../assets/original-ac9218d1542876614a213813238b6ae6.mp4',
  ];

  isLoggedIn: boolean = false;
  role: string = '';
  featuredDoctors: any[] = [];

  features = [
    {
      title: 'AI-Powered Patient Reports',
      desc: 'Automatically generate detailed reports after each patient visit using AI — saving time and improving accuracy.',
      icon: "<i class='bx bxs-report text-2xl'></i>",
    },
    {
      title: 'Smart Appointment Scheduling',
      desc: 'Allow patients to book, reschedule, and manage appointments with real-time availability and reminders.',
      icon: "<i class='bx bx-calendar-check text-2xl'></i>",
    },
    {
      title: 'Doctor Dashboard',
      desc: 'Access a centralized view of your daily schedule, patient info, and clinic performance from one smart dashboard.',
      icon: "<i class='bx bx-customize text-2xl'></i>",
    },
    {
      title: 'AI Assistant for Diagnosis & Notes',
      desc: 'Let AI assist with note-taking and preliminary diagnostics to speed up consultations and improve documentation.',
      icon: "<i class='bx bx-brain text-2xl'></i>",
    },
    {
      title: 'Integrated Patient Records',
      desc: 'View complete patient history, prescriptions, and lab results in one secure, easy-to-navigate place.',
      icon: "<i class='bx bx-folder text-2xl'></i>",
    },
    {
      title: 'Telehealth & Video Consultations',
      desc: 'Offer video consultations directly through the platform with secure, high-quality calling support.',
      icon: "<i class='bx bxs-video text-2xl'></i>",
    },
  ];
  page: number = 1;
  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('token') ? true : false;
    // Check if user is a patient - in a real app, you would get this from your auth service
    // This is a simplified example
    this.role =
      JSON.parse(localStorage.getItem('user') || '{}')?.roles?.[0] || null;
    // In a real application, you would fetch this data from an API
    console.log(this.role);

    this.loadFeaturedDoctors();
  }

  loadFeaturedDoctors(): void {
    // This would typically be an API call
    // For demo purposes, we're using static data
    this.featuredDoctors = [
      {
        id: 1,
        name: 'Dr. Mohamed Farouk',
        specialty: 'Dermatology',
        location: 'Heliopolis, El Khalifa',
        rating: 4.9,
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        id: 2,
        name: 'Dr. Ahmed Ghalwash',
        specialty: 'Gastroenterology',
        location: 'Dokki, Mohandessin',
        rating: 4.8,
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      {
        id: 3,
        name: 'Dr. Ayman Abo Leila',
        specialty: 'General Surgery',
        location: 'Dokki, Mohandessin',
        rating: 4.7,
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      {
        id: 4,
        name: 'Dr. Ismail Ahmed Shafiq',
        specialty: 'General Surgery',
        location: 'Dokki, Mohandessin',
        rating: 4.9,
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
      {
        id: 5,
        name: 'Dr. Mohamed Ismail',
        specialty: 'Cardiology',
        location: '6th of October',
        rating: 4.8,
        image: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
      {
        id: 6,
        name: 'Dr. Hany El Bahr',
        specialty: 'Urology',
        location: 'Dokki, Mohandessin',
        rating: 4.6,
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
    ];
    this.doctorService
      .getAllDoctors({
        pageSize: 5,
        PageIndex: this.page,
      })
      .subscribe((res) => {
        this.featuredDoctors = res.data;
      });
  }

  filterDoctorsBySpecialty(specialty: string): void {
    // This would filter doctors by specialty
    // In a real app, this might trigger an API call with filters
    console.log('Filtering by specialty:', specialty);
  }

  bookAppointment(doctor: any) {
    this.router.navigate(['/book-appointment']);
    this.doctorService.setDoctor(doctor);
  }
}
