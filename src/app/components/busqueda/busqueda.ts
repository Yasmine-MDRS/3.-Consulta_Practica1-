import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/producto.model';
import { ProductCardComponent } from '../producto-card/producto-card.component';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css'
})
export class BusquedaComponent {

  productos = signal<Product[]>([]);
  termino = '';

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private carritoService: CarritoService
  ) {
    this.route.queryParams.subscribe(params => {
      this.termino = params['q'] || '';

      if (this.termino) {
        this.productsService.buscar(this.termino).subscribe({
          next: (data) => this.productos.set(data),
          error: (err) => console.error('Error en búsqueda:', err)
        });
      }
    });
  }

  agregar(producto: Product) {
    this.carritoService.agregar(producto);
  }
}