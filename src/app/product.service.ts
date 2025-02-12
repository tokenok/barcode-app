// src/app/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Example API endpoint – adjust as needed.
  private apiUrl = 'https://api.upcitemdb.com/prod/trial/lookup';

  constructor(private http: HttpClient) { }

  getProductInfo(upc: string): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params: { upc } });
  }
}