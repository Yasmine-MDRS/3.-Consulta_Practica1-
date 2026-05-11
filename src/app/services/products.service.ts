import { Injectable, inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from "../models/producto.model";

@Injectable({ providedIn: 'root' })
export class ProductsService {  

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/productos';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  buscar(termino: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/buscar?q=${termino}`
    );
  }
  getByCategoria(categoria: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/categoria/${categoria}`
    );
  }
  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}