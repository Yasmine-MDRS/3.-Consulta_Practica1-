import { Component, inject, computed,HostListener, ElementRef } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CarritoComponent } from '../carrito/carrito';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CarritoComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {

  carrito = inject(CarritoService);
  showCart = false;
  constructor(private elementRef: ElementRef) {}
  toggleCart() {
    this.showCart = !this.showCart;
  }

  totalItems = computed(() => this.carrito.productos().length);
  totalPrice = computed(() =>
    this.carrito.productos().reduce((total, p) => total + p.precio, 0)
  );

  @HostListener('document:click', ['$event'])
clickOutside(event: Event) {
  if (!this.elementRef.nativeElement.contains(event.target)) {
    this.showCart = false;
  }
}
}