import { Component, Input } from '@angular/core';
import type { Product } from '../../models/producto.model';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
@Component({
  selector: 'app-producto-card',
  templateUrl: './producto-card.component.html',
  styleUrls: ['./producto-card.component.css'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe]
})
export class ProductCardComponent {
  @Input() product!: Product; // ⚡ esto ya no es un Signal
}