import { Component, ChangeDetectorRef } from '@angular/core';
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
  cargando = false;
  private toastTimer: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  mostrarToast(mensaje: string) {
    clearTimeout(this.toastTimer);

    this.toastMensaje = mensaje;
    this.toastVisible = true;
    this.cdr.detectChanges();

    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  iniciarSesion() {
    if (!this.correo.trim() || !this.contrasena.trim()) {
      this.mostrarToast('Completa todos los campos');
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    this.authService.login({
      correo: this.correo,
      contrasena: this.contrasena
    }).subscribe({
      next: (res) => {
        this.cargando = false;
        this.cdr.detectChanges();

        this.authService.guardarSesion(res.token, res.usuario);

        if (res.usuario.rol === 'admin') {
          this.router.navigate(['/admin-stock']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.cdr.detectChanges();

        this.mostrarToast(
          err.error?.message || 'Correo o contraseña incorrectos'
        );
      }
    });

    setTimeout(() => {
      this.cargando = false;
      this.cdr.detectChanges();
    }, 5000);
  }
}