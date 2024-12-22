import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../model/APIResponse';
import { UserDto } from '../../../model/UserDTO';
import { ProfileDto } from '../../../model/ProfileDTO';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  private profileUrl = environment.profileUrl;
  private editProfileUrl = environment.editProfileUrl;
  private deleteProfileUrl = environment.deleteProfileUrl;

  getUser(body: UserDto): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.profileUrl, body);
  }

  editUser(body: ProfileDto): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.editProfileUrl, body);
  }

  deleteUser(body: ProfileDto): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.deleteProfileUrl, body);
  }
}
