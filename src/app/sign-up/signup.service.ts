import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { SignupDto } from '../../model/SignupDTO';
import { Observable } from 'rxjs';
import { APIResponse } from '../../model/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

   private signupUrl = environment.signupUrl;
  
    signup(body: SignupDto): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.signupUrl, body);
    }
}
