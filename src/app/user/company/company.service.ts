import { Injectable } from '@angular/core';
import { SourceCompany } from '../../../model/SourceCompany';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { APIResponse } from '../../../model/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }
  
    createCompanyUrl = environment.createCompanyUrl;
    getAllCompanyUrl = environment.getAllCompanyUrl;
    editCompanyUrl = environment.editCompanyUrl;
  
    createCompany(body: SourceCompany): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.createCompanyUrl, body);
    }
  
    getAllCompany(): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.getAllCompanyUrl);
    }
  
    editCompany(body: SourceCompany): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.editCompanyUrl, body);
    }
}
