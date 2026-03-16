import { Component, computed, signal, Signal } from '@angular/core';
import { Product } from '../../models/producto.model';
import { ProductsService } from '../../services/products.service';
import { ProductCardComponent } from '../producto-card/producto-card.component';
import { CarritoComponent } from '../carrito/carrito';
import { CarritoService } from '../../services/carrito.service';


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent, CarritoComponent],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class Catalogo { 
  products = signal<Product[]>([]);
  inStockCount = computed(() => this.products().filter(p => p.stock > 0).length);

  constructor(
    private productsService: ProductsService,
    private carritoService: CarritoService
  ) {
    this.productsService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error cargando XML:', err),
    });
  }
showCart = signal(false);

cartCount = computed(() =>
  this.carritoService.productos().length
);

toggleCart() {
  this.showCart.update(v => !v);
}
  agregar(producto: Product) {
    this.carritoService.agregar(producto);
  }
}

