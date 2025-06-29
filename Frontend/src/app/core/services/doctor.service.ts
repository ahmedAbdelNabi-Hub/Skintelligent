import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPagination } from '../models/interface/IPagination';
import { Doctor } from '../types/Doctor';
import { IPaginationParam } from '../models/interface/IPaginationParam';
import { config } from '../../../environments/config';
import { IBaseApiResponse } from '../models/interface/IBaseApiResponse';
import { IDoctor } from '../models/interface/doctor/IDoctor';
import { IPatient } from '../models/interface/Patient/IPatient';
import { IReview } from '../models/interface/doctor/IReview';
import { IAppointmentWithPatient } from '../models/interface/IAppointmentWithPatient';

export interface ClinicDTO {
  id: number;
  clinicName: string;
  address: string;
  contactNumber: string;
  createdDate: string;
  email: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private selectedDoctor: any;
  private _http = inject(HttpClient);
  private clinicSubject = new BehaviorSubject<ClinicDTO | null>(null);
  currentClinic$ = this.clinicSubject.asObservable();

  setDoctor(doctor: any) {
    this.selectedDoctor = doctor;
    localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
  }
  
  setClinic(clinic: ClinicDTO): void {
    this.clinicSubject.next(clinic);
  }

  clearClinic(): void {
    this.clinicSubject.next(null);
  }

  getDoctor(): any {
    if (this.selectedDoctor) {
      return this.selectedDoctor;
    }

    const saved = localStorage.getItem('selectedDoctor');
    if (saved) {
      this.selectedDoctor = JSON.parse(saved);
      return this.selectedDoctor;
    }

    return null;
  }

  getDoctorsWithClinicId(
    _PaginationParam: IPaginationParam,
    clinicId: string
  ): Observable<IPagination<Doctor>> {
    return this._http.get<IPagination<Doctor>>(
      `${config.API_Test_Localhost}/api/clinics/${clinicId}/doctors?PageIndex=${_PaginationParam.PageIndex}&PageSize=${_PaginationParam.pageSize}`
    );
  }
  deleteDoctor(id: string) {
    return this._http.delete<IDoctor>(
      config.API_Test_Localhost + `/api/doctors/${id}`
    );
  }



  getAllDoctors(
    _PaginationParam: IPaginationParam
  ): Observable<IPagination<Doctor>> {
    const params = new HttpParams()
      .set('PageIndex', _PaginationParam.PageIndex.toString())
      .set('PageSize', _PaginationParam.pageSize.toString())
      .set('Search', _PaginationParam.Search || '');
    return this._http.get<IPagination<Doctor>>(
      `${config.API_URL}/api/doctors`,
      { params }
    );
  }

  getDoctorReviews(
    doctorId: string,
    _PaginationParam: IPaginationParam
  ): Observable<any> {
    return this._http.get<any>(
      `${config.API_URL}/api/reviews/doctor/${doctorId}?PageIndex=${_PaginationParam.PageIndex}&PageSize=${_PaginationParam.pageSize}`
    );
  }

  getRecentlyDoctors(
    _PaginationParam: IPaginationParam
  ): Observable<IPagination<Doctor>> {
    return this._http.get<IPagination<Doctor>>(
      `${config.API_URL}/api/doctors`,
      { params: { Recently: true } }
    );
  }

  geAllDoctorsByClinicToken(
    _PaginationParam: IPaginationParam
  ): Observable<IPagination<Doctor>> {
    return this._http.get<IPagination<Doctor>>(
      `${config.API_Test_Localhost}/api/clinics/doctors?PageIndex=${_PaginationParam.PageIndex
      }&PageSize=${_PaginationParam.pageSize}&Search=${_PaginationParam.Search || ''
      }&Filter=${_PaginationParam.Filter || ''}`
    );
  }
  getDoctorById(id: number): Observable<IDoctor[]> {
    return this._http.get<IDoctor[]>(
      config.API_Test_Localhost + `/api/doctors/${id}`
    );
  }

  updateProfileDoctor(data: any): Observable<IBaseApiResponse> {
    return this._http.put<IBaseApiResponse>(
      config.API_Test_Localhost + `/api/doctor`,
      data
    );
  }

  createDoctorAccount(doctor: any): Observable<any> {
    return this._http.post<any>(
      config.API_Test_Localhost + '/api/doctors',
      doctor
    );
  }

  getPatients(_PaginationParam: IPaginationParam): Observable<IPagination<IPatient>> {
    const params = new HttpParams()
      .set('PageIndex', _PaginationParam.PageIndex)
      .set('PageSize', _PaginationParam.pageSize)
      .set('Search', _PaginationParam.Search || '');

    return this._http.get<IPagination<IPatient>>(
      `${config.API_Test_Localhost}/api/doctors/patients`,
      { params }
    );
  }
  getAppointmentsByDate(_PaginationParam: IPaginationParam, clinicId: number, date: string): Observable<IPagination<IAppointmentWithPatient>> {
    const params = new HttpParams()
      .set('PageIndex', _PaginationParam.PageIndex)
      .set('PageSize', _PaginationParam.pageSize)
      .set('Search', _PaginationParam.Search || '') 
      .set('clinicId', clinicId)
      .set('date', date);
  
    return this._http.get<IPagination<IAppointmentWithPatient>>(
      `${config.API_Test_Localhost}/api/appointments/date`, 
      { params }
    );
  }
  


  unassignPatient(patientId: number): Observable<IBaseApiResponse> {
    return this._http.delete<IBaseApiResponse>(`${config.API_Test_Localhost}/api/doctors/patients/${patientId}`);
  }

  getDoctorReviewById(doctorId: string): Observable<IPagination<IReview>> {
    return this._http.get<IPagination<IReview>>(
      `${config.API_Test_Localhost}/api/reviews/doctor/${doctorId}?PageSize=10&PageIndex=1`
    );
  }
  getClinicsByDoctorId(doctorId: number, pageIndex: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    return this._http.get(`${config.API_Test_Localhost}/api/doctors/${doctorId}/clinics`, { params });
  }

}
