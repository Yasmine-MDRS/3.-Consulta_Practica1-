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

  const resultados = typeof window !== 'undefined'
    ? window.localStorage.getItem('resultadosBusqueda')
    : null;

  if (resultados) {
    this.products.set(JSON.parse(resultados));

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('resultadosBusqueda');
    }

  } else {
    // SOLO carga todo si no hay búsqueda
    this.productsService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error cargando BD:', err),
    });
  }
    this.carritoService.stockChange$.subscribe(({ id, cambio }) => {
      const lista = this.products();
      const index = lista.findIndex(p => p.id === id);

      if (index === -1) return;

      const nuevaLista = [...lista];

      nuevaLista[index] = {
        ...nuevaLista[index],
        stock: nuevaLista[index].stock + cambio
      };

      this.products.set(nuevaLista);
    });
  }
  agregar(producto: Product) {
    const lista = this.products();
    const index = lista.findIndex(p => p.id === producto.id);

    if (index === -1) return;

    if (lista[index].stock <= 0) {
      alert('Sin stock disponible');
      return;
    }
        this.carritoService.agregar(producto);
  }
}