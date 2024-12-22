import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../model/APIResponse';
import { LoginDTO } from '../../model/LoginDTO';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private loginUrl = environment.loginUrl;

  login(body: LoginDTO): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.loginUrl, body);
  }
}
