import { Component, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { ProductCardComponent } from '../producto-card/producto-card.component';

@Component({
  standalone: true,
  selector: 'app-categorias',
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
  imports: [ProductCardComponent]
})
export class CategoriasComponent {

  categorias = signal<string[]>([]);
  productos = signal<Product[]>([]);
  categoriaActiva = signal<string>('');

  constructor(
    private productService: ProductsService,
    private carritoService: CarritoService
  ) {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.productService.getCategorias().subscribe({
      next: (data: string[]) => {
        this.categorias.set(data);

        if (data.length > 0) {
          this.cargarCategoria(data[0]);
        }
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  cargarCategoria(cat: string) {
    this.categoriaActiva.set(cat);

    this.productService.getByCategoria(cat).subscribe({
      next: (data: Product[]) => {
        this.productos.set(data);
      },
      error: (err) => {
        console.error('Error cargando productos por categoría:', err);
      }
    });
  }

  agregar(producto: Product) {
    this.carritoService.agregar(producto);
  }
}