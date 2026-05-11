import { Component, EventEmitter,Input,Output } from '@angular/core';
import type { Product } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [],
  templateUrl: './producto-card.component.html',
  styleUrls: ['./producto-card.component.css'], 
})
export class ProductCardComponent {
   @Input({ required: true }) product!: Product;
  @Output() add = new EventEmitter<Product>();
  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}
verDetalle() {
    this.router.navigate(['/producto', this.product.id]);
  }

  onAdd(event: Event) {
  event.stopPropagation(); 
  if (this.product.stock <= 0) {
    return;
  }
  this.add.emit(this.product);
  alert(`Agregaste correctamente al carrito: ${this.product.nombre}`);
}
}