import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  correo = '';
  contrasena = '';
  domicilio = '';

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
validarPassword(password: string): boolean {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
  return regex.test(password);
}
 registrarse() {
  if (!this.correo.trim() || !this.contrasena.trim() || !this.domicilio.trim()) {
    this.mostrarToast('Completa todos los campos para registrarte');
    return;
  }

  if (!this.validarPassword(this.contrasena)) {
    this.mostrarToast('La contraseña debe tener mínimo 6 caracteres, letras, números y un símbolo especial');
    return;
  }

  this.authService.register({
    correo: this.correo,
    contrasena: this.contrasena,
    domicilio: this.domicilio
  }).subscribe({
    next: () => {
      this.mostrarToast('Usuario registrado correctamente');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    },
    error: (err) => {
      this.mostrarToast(err.error?.message || 'Error al registrar usuario');
    }
  });
}
}