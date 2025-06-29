import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAdminDashboard } from '../models/interface/Admin/IAdminDashboard';
import { BehaviorSubject, Observable, filter, of, switchMap, tap, shareReplay } from 'rxjs';
import { AppointmentVolumeData } from '../models/interface/IAppointmentVolumeData';
import { DashboardCounters } from '../models/interface/IDashboardCounters';
import { config } from '../../../environments/config';
import { IClinicDashboard } from '../models/interface/IClinicDashboard';
import { IDoctorPerformance } from '../models/interface/IDoctorPerformance';
import { IAppointmentsPerDay } from '../models/interface/IAppointmentsPerDay';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
    private readonly baseUrl = `${config.API_Test_Localhost}/api/analytics`;
    private http = inject(HttpClient);
    private adminDashboardCache$ = new BehaviorSubject<IAdminDashboard | null>(null);
    private adminDashboardRequest$: Observable<IAdminDashboard> | null = null;

    constructor() { }

    getAdminDashboard(forceRefresh: boolean = false): Observable<IAdminDashboard> {
        const cachedData = this.adminDashboardCache$.getValue();
        if (cachedData && !forceRefresh) {
            return this.adminDashboardCache$.asObservable().pipe(
                filter((data): data is IAdminDashboard => data !== null)
            );
        }
        if (this.adminDashboardRequest$ && !forceRefresh) {
            return this.adminDashboardRequest$;
        }
        this.adminDashboardRequest$ = this.http
            .get<IAdminDashboard>(`${this.baseUrl}/admin-dashboard`)
            .pipe(
                tap(response => {
                    this.adminDashboardCache$.next(response);
                    this.adminDashboardRequest$ = null;
                }),
                shareReplay(1)
            );

        return this.adminDashboardRequest$;
    }

    getCompletedAppointmentsByMonth(year?: number): Observable<AppointmentVolumeData[]> {
        let params = new HttpParams();
        if (year) {
            params = params.set('year', year.toString());
        }

        return this.http.get<AppointmentVolumeData[]>(`${this.baseUrl}/appointments/completed`, {
            params: params
        });
    }
    getDoctorDashboard(): Observable<DashboardCounters> {
        return this.http.get<DashboardCounters>(`${this.baseUrl}/dashboard/doctor`);
    }

    getClinicDashboard(): Observable<IClinicDashboard> {
        return this.http.get<IClinicDashboard>(`${this.baseUrl}/clinic-dashboard`);
    }
    getDoctorPerformance(): Observable<IDoctorPerformance[]> {
        return this.http.get<IDoctorPerformance[]>(`${this.baseUrl}/clinic/doctor-performance`);
    }
    getAppointmentsPerDay(): Observable<IAppointmentsPerDay[]> {
        return this.http.get<IAppointmentsPerDay[]>(`${this.baseUrl}/clinic/appointments-per-day`);
      }



    clearCache(): void {
        this.adminDashboardCache$.next(null);
        this.adminDashboardRequest$ = null;
    }

}
