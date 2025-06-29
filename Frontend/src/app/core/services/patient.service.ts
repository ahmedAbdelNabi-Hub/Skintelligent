import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from '../models/interface/IPagination';
import { IPatient } from '../models/interface/Patient/IPatient';
import { IBaseApiResponse } from '../models/interface/IBaseApiResponse';
import { config } from '../../../environments/config';
import { IPaginationParam } from '../models/interface/IPaginationParam';

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http: HttpClient) {}
  getPatientDetails(id: string) {
    return this.http.get(`${config.API_Test_Localhost}/api/patients/${id}`);
  }

  getAllPatient(
    PaginationParam: IPaginationParam
  ): Observable<IPagination<IPatient>> {
    const params = new HttpParams()
      .set('PageIndex', PaginationParam.PageIndex.toString())
      .set('PageSize', PaginationParam.pageSize.toString())
      .set('Search', PaginationParam.Search || '');
    return this.http.get<IPagination<IPatient>>(
      `${config.API_Test_Localhost}/api/patients`,
      { params }
    );
  }
  delete(id: number): Observable<IBaseApiResponse> {
    return this.http.delete<IBaseApiResponse>(
      `${config.API_Test_Localhost}/api/patients/${id}`
    );
  }
}
