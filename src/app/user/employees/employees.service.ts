import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../model/APIResponse';
import { EditRoleDto } from '../../../model/EditRole';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  private getAllUsersUrl = environment.getAllUsersUrl;
  private editRoleUrl = environment.editRoleUrl;

  getAllUsers(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.getAllUsersUrl);
  }

  editRole(body: EditRoleDto): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.editRoleUrl, body);
  }
}
