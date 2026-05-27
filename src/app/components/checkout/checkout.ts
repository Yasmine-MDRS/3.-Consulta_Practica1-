import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { PedidosService } from '../../services/pedidos';

declare const paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements AfterViewInit {

  @ViewChild('paypalButtonContainer')
  paypalButtonContainer!: ElementRef<HTMLDivElement>;

  private carritoService = inject(CarritoService);
  private paypalService = inject(PaypalService);
  private pedidosService = inject(PedidosService);
  private router = inject(Router);

  carrito = this.carritoService.productos;
  total = () => this.carritoService.total();

  mensaje = '';

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderPaypalButton();
    });
  }

  private setMensaje(texto: string): void {
    setTimeout(() => {
      this.mensaje = texto;
    });
  }

  private getUsuarioSesion(): any {
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  private renderPaypalButton(): void {
    if (this.carrito().length === 0) {
      return;
    }

    if (typeof paypal === 'undefined') {
      this.setMensaje('No se cargó el SDK de PayPal.');
      return;
    }

    if (!this.paypalButtonContainer) {
      return;
    }

    this.paypalButtonContainer.nativeElement.innerHTML = '';

    paypal.Buttons({
      createOrder: async () => {
        try {
          const itemsCompra = [...this.carrito()];
          const totalCompra = this.total();

          console.log('Carrito real:', itemsCompra);

          const response = await firstValueFrom(
            this.paypalService.crearOrden({
              items: itemsCompra,
              total: totalCompra
            })
          );

          return response.id;

        } catch (error) {
          console.error('Error al crear la orden:', error);
          this.setMensaje('No se pudo crear la orden.');
          throw error;
        }
      },

      onApprove: async (data: any) => {
        try {
          const itemsCompra = [...this.carrito()];
          const totalCompra = this.total();

          const usuario = this.getUsuarioSesion();

          if (!usuario.id_user) {
            this.setMensaje('No se encontró el usuario de la sesión.');
            return;
          }

          const capture = await firstValueFrom(
            this.paypalService.capturarOrden(
              data.orderID,
              itemsCompra
            )
          );

          console.log('Pago capturado:', capture);

          await firstValueFrom(
            this.pedidosService.crearPedido({
              id_user: usuario.id_user,
              total: totalCompra,
              items: itemsCompra
            })
          );

          console.log('Pedido guardado correctamente');

          this.carritoService.exportarXML();
          this.carritoService.confirmarCompra();

          this.paypalButtonContainer.nativeElement.innerHTML = '';

          this.setMensaje('Pago realizado correctamente.');

          alert('¡Gracias por tu compra!');

          this.router.navigate(['/perfil']);

        } catch (error) {
          console.error('Error al capturar el pago:', error);
          this.setMensaje('Ocurrió un error al capturar el pago.');
        }
      },

      onCancel: () => {
        this.setMensaje('El usuario canceló el pago.');
      },

      onError: (error: any) => {
        console.error('Error PayPal:', error);
        this.setMensaje('Error en el proceso de PayPal.');
      }
    }).render(this.paypalButtonContainer.nativeElement);
  }
}