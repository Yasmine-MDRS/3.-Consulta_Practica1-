import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
})
export class CarritoComponent {
  private carritoService = inject(CarritoService);

  // Vinculación a señales del servicio
  carrito = this.carritoService.productos; 
  total = this.carritoService.total;

  // Contador dinámico de items para la etiqueta superior
  totalItems = computed(() => {
    return this.carrito().reduce((acc, p) => acc + (p.cantidad || 1), 0);
  });

  // Métodos de acción que llaman al servicio
  agregarUno(item: any) {
    this.carritoService.agregar(item);
  }

  quitar(id: number) {
    this.carritoService.quitar(id);
  }

  vaciar() {
    this.carritoService.vaciar();
  }

  exportarXML() {
    this.carritoService.exportarXML();
  }
}