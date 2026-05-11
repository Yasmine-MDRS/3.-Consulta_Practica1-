import { Component, inject, computed, HostListener, ElementRef } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CarritoComponent } from '../carrito/carrito';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CarritoComponent, RouterLink, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {

  // BUSCADOR
  busqueda: string = '';

  // CARRITO
  carrito = inject(CarritoService);
  showCart = false;

  totalItems = computed(() => this.carrito.productos().length);

  totalPrice = computed(() =>
    this.carrito.productos().reduce((total, p) => total + p.precio * (p.cantidad || 1), 0)
  );

  constructor(
    private elementRef: ElementRef,
    private productsService: ProductsService,
    private router: Router
  ) {}

  //BUSCAR
 onBuscar(event: Event) {
  event.preventDefault();

  if (!this.busqueda.trim()) return;

  this.router.navigate(['/buscar'], {
    queryParams: { q: this.busqueda }
  });
   this.busqueda = '';
}
  toggleCart() {
    this.showCart = !this.showCart;
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showCart = false;
    }
  }
}