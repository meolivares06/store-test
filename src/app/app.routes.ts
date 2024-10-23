import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@app/layout/layout.routes').then(l => l.layoutRoutes)
  },
  {
    path: 'not-found',
    loadComponent: () => import('@app/layout/not-found/not-found.component').then((c) => c.NotFoundComponent)
  },
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];
