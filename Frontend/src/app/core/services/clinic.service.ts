import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { config } from '../../../environments/config';
import { IPagination } from '../models/interface/IPagination';
import { Clinic } from '../types/Clinic';
import { IBaseApiResponse } from '../models/interface/IBaseApiResponse';
import { IPaginationParam } from '../models/interface/IPaginationParam';
@Injectable({ providedIn: 'root' })
export class ClinicService {
  constructor(private _Http: HttpClient) { }
  private IsClinicDetails = new BehaviorSubject<boolean>(false); // Set default value
  IsClinicDetails$ = this.IsClinicDetails.asObservable();
  private clinicId = new BehaviorSubject<string>('');
  clinicId$ = this.clinicId.asObservable();

  ApprovedClinicAccount(clinicId: string): Observable<IBaseApiResponse> {
    const url = `${config.API_Test_Localhost}${config.ENDPOINTS.CLINICS}/${clinicId}/approve`;
    return this._Http.patch<IBaseApiResponse>(`${url}`, {});
  }

  BlockClinicAccount(clinicId: string): Observable<IBaseApiResponse> {
    const url = `${config.API_Test_Localhost}${config.ENDPOINTS.CLINICS}/${clinicId}/block`;
    return this._Http.patch<IBaseApiResponse>(`${url}`, {});
  }

  getUnapprovedClinics(): Observable<IPagination<Clinic>> {
    return this._Http.get<IPagination<Clinic>>(
      `${config.API_Test_Localhost}${config.ENDPOINTS.UNAPPROVE_CLINIC}`
    );
  }
  getapprovedClinics(
    PaginationParam: IPaginationParam
  ): Observable<IPagination<Clinic>> {
    const params = new HttpParams()
      .set('PageIndex', PaginationParam.PageIndex.toString())
      .set('PageSize', PaginationParam.pageSize.toString())
      .set('Search', PaginationParam.Search || '');
    return this._Http.get<IPagination<Clinic>>(
      `${config.API_Test_Localhost}${config.ENDPOINTS.CLINICS}`, { params }
    );
  }

  ShowPageClinicDetails(): void {
    this.IsClinicDetails.next(true);
  }
  HiddenPageClinicDetails(): void {
    this.IsClinicDetails.next(false);
  }

  getClinicId(): string {
    return this.clinicId.value;
  }

  setClinicId(clinicId: string): void {
    this.clinicId.next(clinicId);
  }

  getAppointmentsByDate(date: Date): Observable<any[]> {
    return this._Http.get<any[]>(
      `${config.API_URL}${config.ENDPOINTS.CLINICS
      }/appointments?date=${date.toDateString()}`
    );
  }

  rejectClinic(clinicId: string): Observable<IBaseApiResponse> {
    return this._Http.post<IBaseApiResponse>(`${config.API_URL}/api/clinics/${clinicId}/reject`, {});
  }


  upgradeToPro(price: number, accountType :string, paymentMethod: string = 'Stripe')  {
    return this._Http.post<{ url: string; message: string }>(
      `${config.API_URL}/api/clinics/upgrade-to-pro`,
      { price, accountType ,paymentMethod }
    );
  }
  confirmPayment(sessionId: string, accountType: string) : Observable<IBaseApiResponse> {
    const body = {
      sessionId,
      accountType
    };
    return this._Http.post<IBaseApiResponse> (`${config.API_URL}/api/clinics/confirm-payment`, body);
  }

  delete(id:number):Observable<IBaseApiResponse> {
    return this._Http.delete<IBaseApiResponse>(`${config.API_URL}/api/clinics/${id}`);
  }

}
