import { Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/auth-page/auth-page';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: AuthPageComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'devices',
        loadComponent: () => import('./features/device/device-list/device-list').then(m => m.DeviceList)
      },
      {
        path: 'collabs',
        loadComponent: () => import('./features/collaborators/collab-list/collab-list').then(m => m.CollabList)
      },
      {
        path: 'orgs',
        canActivate: [authGuard],
        data: { roles: ['MANAGER'] },
        loadComponent: () => import('./features/organizations/org-list/org-list').then(m => m.OrgList)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
