import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Product } from "../models/producto.model";

@Injectable({ providedIn: 'root' })
export class ProductsService {  

  private http=inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/productos';
  getAll():Observable<Product[]>{
    return this.http.get<Product[]>(this.apiUrl);
  }
}