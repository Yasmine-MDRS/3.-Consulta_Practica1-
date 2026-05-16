import { Routes } from '@angular/router';
import {Catalogo} from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito';
import { CheckoutComponent } from './components/checkout/checkout';
import{ BusquedaComponent } from './components/busqueda/busqueda';
import { ProductDetalle } from './components/producto-detalle/product-detalle/product-detalle';
import { CategoriasComponent } from './components/categorias/categorias';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
//import { PerfilComponent } from './components/perfil/perfil';
import{Home} from './components/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
 {path:'home',component:Home},
  { path: 'catalogo', component: Catalogo }, 
  { path: 'carrito', component: CarritoComponent },
  { path: 'checkout', component: CheckoutComponent },
  {path:'buscar',component:BusquedaComponent},
  { path: 'producto/:id', component: ProductDetalle},
  { path: 'categorias', component: CategoriasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: "" } 
];