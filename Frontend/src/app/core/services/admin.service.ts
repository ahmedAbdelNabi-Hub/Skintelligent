import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAdmin } from '../models/interface/Admin/IAdmin';
import { config } from '../../../environments/config';
import { IBaseApiResponse } from '../models/interface/IBaseApiResponse';

@Injectable({ providedIn: 'root' })
export class AdminService {

    private _http = inject(HttpClient);

    getAllAdmin(): Observable<IAdmin[]> {
        return this._http.get<IAdmin[]>(`${config.API_Test_Localhost}/api/admins`)
    }

    createAdmin(admin: any): Observable<IBaseApiResponse> {
        return this._http.post<IBaseApiResponse>(`${config.API_Test_Localhost}/api/admin`, admin)
    }

    deleteAdmin(id: string): Observable<IBaseApiResponse> {
        return this._http.delete<IBaseApiResponse>(`${config.API_Test_Localhost}/api/admins/${id}`)
    }

    update(admin: any): Observable<IBaseApiResponse> {
        return this._http.put<IBaseApiResponse>(`${config.API_Test_Localhost}/api/admins/update`, admin)
    }
    changePassword(data: any): Observable<IBaseApiResponse> {
        return this._http.post<IBaseApiResponse>(`${config.API_Test_Localhost}/api/admins/change-password`, data)
    }

}