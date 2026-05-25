import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  const requiredRoles = route.data?.['roles'] as Array<string>;
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = authStore.currentUser()?.role;
    if (!userRole || !requiredRoles.includes(userRole)) {
      return router.parseUrl('/dashboard');
    }
  }

  return true;
};
