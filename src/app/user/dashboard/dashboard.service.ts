import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../model/APIResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getAuditLogs = environment.getAuditLogs;
  getCounts = environment.getCounts;

  constructor(private http: HttpClient) { }

  getAllAuditLogs(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.getAuditLogs);
  }

  getAllCounts(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.getCounts);
  }
}
