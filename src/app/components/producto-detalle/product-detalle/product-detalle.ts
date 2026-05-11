import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/producto.model';
import { CarritoService } from '../../../services/carrito.service';

@Component({
  standalone: true,
  templateUrl: './product-detalle.html',
  styleUrl: './product-detalle.css'
})
export class ProductDetalle {

  producto = signal<Product | null>(null);

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router,
    private carritoService: CarritoService
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.productsService.getById(id).subscribe((data: Product) => {
        this.producto.set({
          ...data,
          id: Number(data.id),        
          stock: Number(data.stock), 
          precio: Number(data.precio) 
        });
      });
    }
  }

  volver() {
    this.router.navigate(['/catalogo']);
  }

  agregarCarrito() {
    const p = this.producto();
    if (!p) return;

    this.carritoService.agregar(p);
  }
}