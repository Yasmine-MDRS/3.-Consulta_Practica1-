import { Routes } from '@angular/router';
import {Catalogo} from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito';
import { CheckoutComponent } from './components/checkout/checkout';
//import { CategoriasComponent } from './components/categorias/categorias';
//import { PerfilComponent } from './components/perfil/perfil';

export const routes: Routes = [
  { path: "", component: Catalogo }, // Inicio
  { path: 'catalogo', component: Catalogo }, // Ahora sí la encontrará
  { path: 'carrito', component: CarritoComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: "" } 
];