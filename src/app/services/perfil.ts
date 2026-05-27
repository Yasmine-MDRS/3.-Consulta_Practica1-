import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = 'http://localhost:3000/api/perfil';

  constructor(private http: HttpClient) {}

  getPerfil(id_user: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${id_user}`
    );
  }

  actualizarPerfil(
    id_user: number,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id_user}`,
      data
    );
  }
}