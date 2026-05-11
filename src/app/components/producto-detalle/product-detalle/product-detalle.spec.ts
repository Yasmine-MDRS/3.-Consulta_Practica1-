import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetalle } from './product-detalle';

describe('ProductDetalle', () => {
  let component: ProductDetalle;
  let fixture: ComponentFixture<ProductDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
