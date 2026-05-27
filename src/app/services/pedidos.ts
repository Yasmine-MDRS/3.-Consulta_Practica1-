import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'http://localhost:3000/api/pedidos';

  constructor(private http: HttpClient) {}

  // OBTENER HISTORIAL
  getPedidos(id_user: number): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/${id_user}`
    );
  }

  // CREAR PEDIDO
  crearPedido(data: any): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );
  }
}