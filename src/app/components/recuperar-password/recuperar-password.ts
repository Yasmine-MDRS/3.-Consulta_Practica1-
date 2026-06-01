import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css'
})
export class RecuperarPasswordComponent {

  correo = '';
  constructor(
    private passwordService: PasswordResetService,
    private router: Router
  ) {}

toastVisible = false;
toastMensaje = '';
cargando = false;
private toastTimer: any;

mostrarToast(mensaje: string) {
  clearTimeout(this.toastTimer);

  this.toastMensaje = mensaje;
  this.toastVisible = true;

  this.toastTimer = setTimeout(() => {
    this.toastVisible = false;
  }, 3000);
}
  enviarPin() {
    if (!this.correo.trim()) {
      this.mostrarToast('Ingresa tu correo');
      return;
    }

    this.passwordService.solicitarPin(this.correo).subscribe({
      next: () => {
        sessionStorage.setItem('resetCorreo', this.correo);

        this.mostrarToast('PIN enviado al correo');

        setTimeout(() => {
          this.router.navigate(['/verificar-pin']);
        }, 1200);
      },
      error: (err) => {
        this.mostrarToast(err.error?.message || 'Error al enviar PIN');
      }
    });
  }
}