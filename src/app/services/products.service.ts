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

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
getCategorias() {
  return this.http.get<string[]>(
    `${this.apiUrl}/categorias/lista`
  );
}
  getByCategoria(categoria: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/categoria/${categoria}`
    );
  }
  crear(producto: Product) {
  return this.http.post(
    this.apiUrl,
    producto
  );
}
  actualizar(producto: Product): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${producto.id}`,
      producto
    );
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}