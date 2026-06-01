import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../services/perfil';
import { PedidosService } from  '../../services/pedidos';
import {DatePipe} from '@angular/common';
import {Router} from "@angular/router";
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent {

  usuario = signal<any>(null);
  pedidos = signal<any[]>([]);

  mensaje = '';
  editando = false;

  form = {
    correo: '',
    nombre_completo: '',
    domicilio: '',
    rfc: '',
    regimen_fiscal: '',
    uso_cfdi: '',
    codigo_postal: ''
  };

  constructor(
    private perfilService: PerfilService,
    private pedidosService: PedidosService,
    private router: Router
  ) {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || '{}');
    const id_user = usuarioStorage.id_user;

    if (!id_user) return;

    this.perfilService.getPerfil(id_user).subscribe({
      next: (data: any) => {
        this.usuario.set(data);

        this.form = {
          correo: data.correo || '',
          nombre_completo: data.nombre_completo || '',
          domicilio: data.domicilio || '',
          rfc: data.rfc || '',
          regimen_fiscal: data.regimen_fiscal || '',
          uso_cfdi: data.uso_cfdi || '',
          codigo_postal: data.codigo_postal || ''
        };

        localStorage.setItem('usuario', JSON.stringify(data));

        this.cargarPedidos(id_user);
      },
      error: () => {
        this.mensaje = 'Error al cargar perfil';
      }
    });
  }
cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');

  this.router.navigate(['/login']);
}
  cargarPedidos(id_user: number) {
    this.pedidosService.getPedidos(id_user).subscribe({
      next: (data: any[]) => {
        this.pedidos.set(data);
      },
      error: () => {
        this.pedidos.set([]);
      }
    });
  }

  activarEdicion() {
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.cargarPerfil();
  }

  guardarPerfil() {
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || '{}');
    const id_user = usuarioStorage.id_user;

    if (!id_user) return;

    if (
      !this.form.nombre_completo.trim() ||
      !this.form.domicilio.trim() ||
      !this.form.rfc.trim() ||
      !this.form.regimen_fiscal.trim() ||
      !this.form.uso_cfdi.trim() ||
      !this.form.codigo_postal.trim()
    ) {
      this.mensaje = 'Completa todos los datos fiscales';
      return;
    }

    this.perfilService.actualizarPerfil(id_user, this.form).subscribe({
      next: () => {
        this.mensaje = 'Perfil actualizado correctamente';
        this.editando = false;
        this.cargarPerfil();

        setTimeout(() => {
          this.mensaje = '';
        }, 2500);
      },
      error: () => {
        this.mensaje = 'Error al actualizar perfil';
      }
    });
  }
}