import { Routes } from '@angular/router';

export const demoRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@features/dashboard/dashboard.routes').then((c) => c.dashboardRoutes)
  }
];
