import { Routes } from '@angular/router';

import { Catalogo } from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito';
import { CheckoutComponent } from './components/checkout/checkout';
import { BusquedaComponent } from './components/busqueda/busqueda';
import { ProductDetalle } from './components/producto-detalle/product-detalle/product-detalle';
import { CategoriasComponent } from './components/categorias/categorias';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { PerfilComponent } from './components/perfil/perfil';
import { AdminStockComponent } from './components/admin-stock/admin-stock';
import { Home } from './components/home/home';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password';
import { VerificarPinComponent } from './components/verificar-pin/verificar-pin';
import { NuevaPasswordComponent } from './components/nueva-password/nueva-password';
import { adminGuard } from './guards/admin-guard';
import { clienteGuard } from './guards/cliente-guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'verificar-pin', component: VerificarPinComponent },
  { path: 'nueva-password', component: NuevaPasswordComponent },
  // RUTAS CLIENTE
  {
    path: 'home',
    component: Home,
    canActivate: [clienteGuard]
  },
  {
    path: 'catalogo',
    component: Catalogo,
    canActivate: [clienteGuard]
  },
  {
    path: 'categorias',
    component: CategoriasComponent,
    canActivate: [clienteGuard]
  },
  {
    path: 'buscar',
    component: BusquedaComponent,
    canActivate: [clienteGuard]
  },
  {
    path: 'producto/:id',
    component: ProductDetalle,
    canActivate: [clienteGuard]
  },
  {
    path: 'carrito',
    component: CarritoComponent,
    canActivate: [clienteGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [clienteGuard]
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [clienteGuard]
  },

  // RUTA ADMIN
  {
    path: 'admin-stock',
    component: AdminStockComponent,
    canActivate: [adminGuard]
  },

  { path: '**', redirectTo: 'login' }

];