import { Routes } from '@angular/router';
import {Catalogo} from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito';
import { CheckoutComponent } from './components/checkout/checkout';
import{ Busqueda } from './components/busqueda/busqueda';
import { ProductDetalle } from './components/producto-detalle/product-detalle/product-detalle';
import { CategoriasComponent } from './components/categorias/categorias';
//import { PerfilComponent } from './components/perfil/perfil';
import{Home} from './components/home/home';

export const routes: Routes = [
  { path: "", component: Home },
  { path: 'catalogo', component: Catalogo }, 
  { path: 'carrito', component: CarritoComponent },
  { path: 'checkout', component: CheckoutComponent },
  {path:'buscar',component:Busqueda},
  { path: 'producto/:id', component: ProductDetalle},
  { path: 'categorias', component: CategoriasComponent },
  { path: '**', redirectTo: "" } 
];