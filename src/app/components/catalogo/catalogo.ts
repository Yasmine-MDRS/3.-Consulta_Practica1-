import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../services/products.service';
import { ProductCardComponent } from '../producto-card/producto-card.component';
import { CommonModule } from '@angular/common';
import type { Product } from '../../models/producto.model';


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class Catalogo { 
  products!: Signal<Product[] | null>; // ⚡ declarada aquí

  constructor(private productsService: ProductsService) {
    this.products = toSignal<Product[] | null>(
      this.productsService.getAll(),
      { initialValue: null } // ⚡ null inicial
    );
  }
}
