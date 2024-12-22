import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stocks } from '../../../model/Stocks';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../model/APIResponse';
import { environment } from '../../environments/environments';
import { StocksDto } from '../../../model/StocksDto';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor(private http: HttpClient) { }
  
    createStocksUrl = environment.createStocksUrl;
    getAllStocksUrl = environment.getAllStocksUrl;
    editStocksUrl = environment.editStocksUrl;
    getAllCompaniesUrl = environment.getAllCompaniesUrl;
    getAllWarehousesUrl = environment.getAllWarehousesUrl;
    getAllQuantitiesUrl = environment.getAllQuantitiesUrl;
    getAllProductsUrl = environment.getAllProdutsUrl;
  
    createStocks(body: StocksDto): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.createStocksUrl, body);
    }
  
    getAllStocks(): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.getAllStocksUrl);
    }
  
    editStocks(body: StocksDto): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.editStocksUrl, body);
    }

    getAllCompanies(): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.getAllCompaniesUrl);
    }

    getAllWarehouses(): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.getAllWarehousesUrl);
    }

    getAllQuantities(): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.getAllQuantitiesUrl);
    }

    getAllProducts(): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.getAllProductsUrl);
    }
}
