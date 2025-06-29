import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { config } from '../../../environments/config';
import { IPatientSchedule } from '../models/interface/IPatientSchedule';
import { IBaseApiResponse } from '../models/interface/IBaseApiResponse';
import { IAppointmentSummary } from '../models/interface/IAppointmentSummary';
import { IPaginationParam } from '../models/interface/IPaginationParam';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly baseUrl = config.API_URL;

  private appointmentsByWeekSubject = signal<any[]>([]);
  public appointmentsByWeek = this.appointmentsByWeekSubject.asReadonly();

  constructor(private http: HttpClient) { }

  createAppointment(payload: any): Observable<IBaseApiResponse> {
    return this.http.post<IBaseApiResponse>(
      `${this.baseUrl}/api/appointments`,
      payload
    );
  }

  fetchAppointmentsByWeek(
    clinicId: number,
    date: string,
    doctorId: any = 0
  ): Observable<Record<string, any[]>> {
    return this.http.get<Record<string, any[]>>(
      `${this.baseUrl}/api/appointments/week`,
      {
        params: {
          clinicId,
          date,
          doctorId,
        },
      }
    );
  }

  addAppointment(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  getAppointmentsForWeek(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/week`);
  }

  bookAppointment(payload: any) {
    return this.http.post(
      `${this.baseUrl}/api/appointments/book`,
      {},
      {
        params: payload,
      }
    );
  }

  deleteAppointment(id: number | string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  cancelAppointment(id: any): Observable<IBaseApiResponse> {
    return this.http.post<IBaseApiResponse>(
      `${this.baseUrl}/api/appointments/${id}/cancel`,
      {}
    );
  }

  getWeeklyPatients(
    doctorId: number | string,
    clinicId: number | string,
    date: string
  ): Observable<IPatientSchedule[]> {
    const url = `${this.baseUrl}/api/doctors/clinic/${clinicId}/weekly-patients`;
    const params = new HttpParams().set('date', date);
    return this.http.get<IPatientSchedule[]>(url, { params });
  }

  getCompletedConversations(PaginationParam: IPaginationParam) {
    const params = new HttpParams()
    .set('PageIndex', PaginationParam.PageIndex.toString())
    .set('PageSize', PaginationParam.pageSize.toString())
    .set('Search', PaginationParam.Search || '');
    return this.http.get<IAppointmentSummary[]>(`${this.baseUrl}/api/appointments/report`,{ params });
  }
}
