import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'mockdata',
    loadComponent: () => import('@shared/mockdata/mockdata.component').then(c => c.MockdataComponent),
    // loadChildren: () => import('@app/layout/layout.routes').then(l => l.layoutRoutes)
  },
  {
    path: '',
    // loadComponent: () => import('@app/layout/layout.component').then(c => c.LayoutComponent),
    loadChildren: () => import('@app/layout/layout.routes').then(l => l.layoutRoutes)
  },
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];
