import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/password';

  solicitarPin(correo: string) {
    return this.http.post(`${this.apiUrl}/solicitar-pin`, {
      correo
    });
  }

  verificarPin(correo: string, pin: string) {
    return this.http.post(`${this.apiUrl}/verificar-pin`, {
      correo,
      pin
    });
  }

  cambiarPassword(correo: string, pin: string, nuevaPassword: string) {
    return this.http.post(`${this.apiUrl}/cambiar-password`, {
      correo,
      pin,
      nuevaPassword
    });
  }
}