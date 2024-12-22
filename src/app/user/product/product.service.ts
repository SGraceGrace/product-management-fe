import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../model/APIResponse';
import { environment } from '../../environments/environments';
import { ProductDTO } from '../../../model/ProductDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  
    createProductUrl = environment.createProductUrl;
    getAllProductUrl = environment.getAllProductUrl;
    editProductUrl = environment.editProductUrl;
  
    createProduct(body: ProductDTO): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.createProductUrl, body);
    }
  
    getAllProduct(): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.getAllProductUrl);
    }
  
    editProduct(body: ProductDTO): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.editProductUrl, body);
    }
}
