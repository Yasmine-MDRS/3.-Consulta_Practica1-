import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const clienteGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (usuario.rol === 'admin') {
    router.navigate(['/admin-stock']);
    return false;
  }

  return true;
};