import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset';
import{ChangeDetectorRef} from '@angular/core';
@Component({
  selector: 'app-verificar-pin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './verificar-pin.html',
  styleUrl: './verificar-pin.css'
})
export class VerificarPinComponent {

  pin = '';
  correo = sessionStorage.getItem('resetCorreo') || '';

  constructor(
    private passwordService: PasswordResetService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    if (!this.correo) {
      this.router.navigate(['/recuperar-password']);
    }
  }

toastVisible = false;
toastMensaje = '';
cargando = false;
private toastTimer: any;

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

  verificarPin() {
    if (!this.pin.trim()) {
      this.mostrarToast('Ingresa el PIN');
      return;
    }

    if (this.pin.length !== 6) {
      this.mostrarToast('El PIN debe tener 6 dígitos');
      return;
    }

    this.passwordService.verificarPin(this.correo, this.pin).subscribe({
      next: () => {
        sessionStorage.setItem('resetPin', this.pin);

        this.mostrarToast('PIN verificado');

        setTimeout(() => {
          this.router.navigate(['/nueva-password']);
        }, 1000);
      },
      error: (err) => {
        this.mostrarToast(err.error?.message || 'PIN inválido o vencido');
      }
    });
  }

  reenviarPin() {
    this.passwordService.solicitarPin(this.correo).subscribe({
      next: () => {
        this.pin = '';
        this.mostrarToast('Nuevo PIN enviado');
      },
      error: (err) => {
        this.mostrarToast(err.error?.message || 'Error al reenviar PIN');
      }
    });
  }
}
