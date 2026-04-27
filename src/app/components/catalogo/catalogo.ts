import { Component, computed, signal } from '@angular/core';
import { Product } from '../../models/producto.model';
import { ProductsService } from '../../services/products.service';
import { ProductCardComponent } from '../producto-card/producto-card.component';
import { CarritoService } from '../../services/carrito.service';


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class Catalogo {

  products = signal<Product[]>([]);

  inStockCount = computed(() =>
    this.products().filter(p => p.stock > 0).length
  );

  constructor(
    private productsService: ProductsService,
    private carritoService: CarritoService 
  ) {
    this.productsService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error cargando BD:', err),
    });
  }

  agregar(producto: Product) {
    this.carritoService.agregar(producto); 
}
}