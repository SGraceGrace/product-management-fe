import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../model/APIResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllProdutsUrl = environment.getAllProductUrl;
  generateQrCodeUrl = environment.generateQrCode;
  generateProductUrl = environment.generateProduct;

  getAllProducts(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.getAllProdutsUrl);
  }

  generateQrCode(productId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.generateQrCodeUrl+productId);
  }

  generateProduct(): Observable<Blob> {
    return this.http.get(this.generateProductUrl, { responseType: 'blob'});
  }
}
