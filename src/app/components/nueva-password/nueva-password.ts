import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset';
import {ChangeDetectorRef} from '@angular/core';
@Component({
  selector: 'app-nueva-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './nueva-password.html',
  styleUrl: './nueva-password.css'
})
export class NuevaPasswordComponent {

  correo = sessionStorage.getItem('resetCorreo') || '';
  pin = sessionStorage.getItem('resetPin') || '';

  password1 = '';
  password2 = '';

  constructor(
    private passwordService: PasswordResetService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    if (!this.correo || !this.pin) {
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

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    return regex.test(password);    
  }

  cambiarPassword() {
    if (!this.password1.trim() || !this.password2.trim()) {
      this.mostrarToast('Completa ambos campos');
      return;
    }

    if (this.password1 !== this.password2) {
      this.mostrarToast('Las contraseñas no coinciden');
      return;
    }

    if (!this.validarPassword(this.password1)) {
      this.mostrarToast('Mínimo 6 caracteres, letras, números y un símbolo especial');
      return;
    }

    this.passwordService.cambiarPassword(
      this.correo,
      this.pin,
      this.password1
    ).subscribe({
      next: () => {
        sessionStorage.removeItem('resetCorreo');
        sessionStorage.removeItem('resetPin');

        this.mostrarToast('Contraseña actualizada');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        this.mostrarToast(err.error?.message || 'Error al cambiar contraseña');
      }
    });
  }
}