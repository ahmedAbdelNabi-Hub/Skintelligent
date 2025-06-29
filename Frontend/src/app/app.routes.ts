import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleAccessGuard } from './core/guards/role-access.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { PdfViewerComponent } from './features/doctor-dashboard/pages/reports/pdf-viewer.component';
import { BookDoctorComponent } from './features/book-doctor/book-doctor.component';
import { ReportsComponent } from './features/doctor-dashboard/pages/reports/reports.component';
import { PatientProfileComponent } from './features/patient/pages/profile/patient-profile.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'patient/profile',
    component: PatientProfileComponent,
    canActivate: [RoleAccessGuard],
    data: { role: 'patient' },
  },
  {
    path: 'redirect',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./features/pricing/pricing.component').then(
        (m) => m.PricingComponent
      ),
  },
  {
    path: 'text',
    loadComponent: () =>
      import(
        './features/doctor-dashboard/pages/text-editor/text-editor.component'
      ).then((m) => m.TextEditorComponent),
    canActivate: [],
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./features/sign-in/sign-in.component').then(
        (m) => m.SignInComponent
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'verify-account',
    loadComponent: () =>
      import('./features/verify-account/verify-account.component').then(
        (m) => m.VerifyAccountComponent
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./features/forget-password/forget-password.component').then(
        (m) => m.ForgetPasswordComponent
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'account-review',
    loadComponent: () =>
      import('./features/pending-approval/pending-approval.component').then(
        (m) => m.PendingApprovalComponent
      ),
    canActivate: [],
  },
  {
    path: 'clinic-dashboard',
    loadComponent: () =>
      import('./features/clinic-dasboard/clinic-dasboard.component').then(
        (m) => m.ClinicDasboardComponent
      ),
    canActivate: [RoleAccessGuard],
    data: { role: 'clinic' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/clinic-dasboard/pages/statistics/statistics.component'
          ).then((m) => m.StatisticsComponent),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import(
            './features/clinic-dasboard/pages/doctors/doctors.component'
          ).then((m) => m.DoctorsComponent),
      },
      {
        path: 'doctors/:id',
        loadComponent: () =>
          import(
            './features/clinic-dasboard/pages/doctors/doctor-details/doctor-details.component'
          ).then((m) => m.DoctorDetailsComponent),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import(
            './features/clinic-dasboard/pages/appointments/appointments.component'
          ).then((m) => m.AppointmentsComponent),
      },
      {
        path: 'community',
        loadComponent: () =>
          import('./shared/components/chat-group/chat-group.component').then(
            (m) => m.ChatGroupComponent
          ),
      },
      {
        path: 'feedback/:id',
        loadComponent: () =>
          import(
            './features/clinic-dasboard/pages/feedback/pages/feedback-details/feedback-details.component'
          ).then((m) => m.FeedbackDetailsComponent),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import(
            './features/clinic-dasboard/pages/feedback/feedback.component'
          ).then((m) => m.FeedbackComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './features/clinic-dasboard/pages/settings/settings.component'
          ).then((m) => m.SettingssComponent),
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import(
            './features/subscription/pages/subscription/subscription.component'
          ).then((m) => m.SubscriptionComponent),
      },
      {
        path: 'payment-success',
        loadComponent: () =>
          import(
            './features/subscription/pages/payment-success/payment-success.component'
          ).then((m) => m.PaymentSuccessComponent),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/pages/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import(
            './pages/notifications/all-notifications/all-notifications.component'
          ).then((m) => m.AllNotificationsComponent),
      },
    ],
  },
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./features/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    canActivate: [RoleAccessGuard],
    data: { role: 'admin' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/admin-dashboard/pages/dashboard/dashboard.component'
          ).then((m) => m.DashboardComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './features/admin-dashboard/pages/settings/settings.component'
          ).then((m) => m.SettingsComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin-dashboard/pages/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/profile/profile.component'
          ).then((m) => m.ProfileComponent),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import(
            './features/admin-dashboard/pages/doctors-table/doctors-table.component'
          ).then((m) => m.DoctorsTableComponent),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import(
            './features/admin-dashboard/pages/patient-table/patient-table.component'
          ).then((m) => m.PatientTableComponent),
      },
      {
        path: 'manage-clinics',
        loadComponent: () =>
          import(
            './features/admin-dashboard/pages/manage-clinic/manage-clinic.component'
          ).then((m) => m.ManageClinicComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import(
            './pages/notifications/all-notifications/all-notifications.component'
          ).then((m) => m.AllNotificationsComponent),
      },
    ],
  },
  {
    path: 'doctor-dashboard',
    loadComponent: () =>
      import('./features/doctor-dashboard/doctor-dashboard.component').then(
        (m) => m.DoctorDashboardComponent
      ),
    canActivate: [RoleAccessGuard],
    data: { role: 'doctor' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/overview/overview.component'
          ).then((m) => m.OverviewComponent),
        data: { animation: 'Overview' },
      },
      {
        path: 'ai-chat',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/ai-chat/ai-chat.component'
          ).then((m) => m.AiChatComponent),
        data: { animation: 'ai-chat' },
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/profile/profile.component'
          ).then((m) => m.ProfileComponent),
        data: { animation: 'Profile' },
      },
      {
        path: 'appointment',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/appointment/appointment.component'
          ).then((m) => m.AppointmentComponent),
        data: { animation: 'Appointment' },
      },
      {
        path: 'patient',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/patients/patients.component'
          ).then((m) => m.PatientsComponent),
        data: { animation: 'Patients' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/account/account.component'
          ).then((m) => m.AccountComponent),
        data: { animation: 'Settings' },
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/schedule/schedule.component'
          ).then((m) => m.ScheduleComponent),
        data: { animation: 'Schedule' },
      },
      {
        path: 'reports',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/reports/reports.component'
          ).then((m) => m.ReportsComponent),
        data: { animation: 'reports' },
      },
      {
        path: 'report-view',
        loadComponent: () =>
          import(
            './features/doctor-dashboard/pages/reports/pdf-viewer.component'
          ).then((m) => m.PdfViewerComponent),
        data: { animation: 'reports' },
      },
      {
        path: 'community',
        loadComponent: () =>
          import('./shared/components/chat-group/chat-group.component').then(
            (m) => m.ChatGroupComponent
          ),
      },
    ],
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then(
        (m) => m.SearchComponent
      ),
    canActivate: [RoleAccessGuard],
    data: { role: 'patient' },
  },
  {
    path: 'book-appointment',
    loadComponent: () =>
      import('./features/book-doctor/book-doctor.component').then(
        (m) => m.BookDoctorComponent
      ),
    canActivate: [RoleAccessGuard],
    data: { role: 'patient' },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
