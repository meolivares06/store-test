import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@app/layout/layout.routes').then(l => l.layoutRoutes)
  },
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];
