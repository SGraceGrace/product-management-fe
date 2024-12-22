import { Injectable } from '@angular/core';
import { Warehouse } from '../../../model/Warehouse';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../model/APIResponse';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }

  createWarehouseUrl = environment.createWarehouseUrl;
  getAllWarehouseUrl = environment.getAllWarehouseUrl;
  editWarehouseUrl = environment.editWarehouseUrl;

  createWarehouse(body: Warehouse): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.createWarehouseUrl, body);
  }

  getAllWarehouse(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.getAllWarehouseUrl);
  }

  editWarehouse(body: Warehouse): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.editWarehouseUrl, body);
  }
}
