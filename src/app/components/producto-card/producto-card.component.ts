import { Component, EventEmitter,Input,Output } from '@angular/core';
import type { Product } from '../../models/producto.model';

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

  onAdd() {
    this.add.emit(this.product);
}
}