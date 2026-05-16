import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  correo = '';
  contrasena = '';

  toastVisible = false;
  toastMensaje = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  mostrarToast(mensaje: string) {
    this.toastMensaje = mensaje;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 2500);
  }

  iniciarSesion() {
    if (!this.correo.trim() || !this.contrasena.trim()) {
      this.mostrarToast('Completa todos los campos para iniciar sesión');
      return;
    }

    this.authService.login({
      correo: this.correo,
      contrasena: this.contrasena
    }).subscribe({
      next: (res) => {
        this.authService.guardarSesion(res.token, res.usuario);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.mostrarToast(err.error?.message || 'Error al iniciar sesión');
      }
    });
  }
}