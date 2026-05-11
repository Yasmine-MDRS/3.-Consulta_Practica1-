import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/producto.model';
import { ProductCardComponent } from '../../components/producto-card/producto-card.component';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './busqueda.html'
})
export class Busqueda {

  products = signal<Product[]>([]);
  query = '';

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {

    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';

      if (this.query) {
        this.productsService.buscar(this.query).subscribe(data => {
          this.products.set(data);
        });
      }
    });
  }
}