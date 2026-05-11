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

  categorias = [
    'Romance',
    'Novela Romántica',
    'Realismo mágico',
    'Fantasía romántica',
    'Young Adult (Juvenil)',
    'Romantasy',
    'Dark Academia',
    'Thriller Psicológico',
    'Dark Romance',
    'Comedia',
    'Académicos',
    'Terror'
  ];

  productos = signal<Product[]>([]);
  categoriaActiva = signal<string>('Romance');

  constructor(
    private productService: ProductsService,
    private carritoService: CarritoService
  ) {
    // Cargar categoría inicial
    this.cargarCategoria(this.categoriaActiva());
  }

  agregar(producto: Product) {
    this.carritoService.agregar(producto);
  }

  cargarCategoria(cat: string) {
    this.categoriaActiva.set(cat);

    this.productService.getByCategoria(cat)
      .subscribe((data: Product[]) => {
        this.productos.set(data);
      });
  }
}