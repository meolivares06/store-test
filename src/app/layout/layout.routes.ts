import { Routes } from '@angular/router';

export const layoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/layout/layout.component').then(c => c.LayoutComponent),
    children: [

      {path: '', redirectTo: '/client', pathMatch: 'full'},
      {
        path: 'product',
        loadChildren: () => import('@feat/product/product.routes').then(r => r.ProductRoutes)
      },
      {
        path: 'client',
        loadChildren: () => import('@feat/client/client.routes').then(r => r.ClientRoutes)
      },
      {
        path: 'sell',
        loadChildren: () => import('@feat/sell/sell.routes').then(r => r.SellRoutes)
      },
      {
        path: 'not-found',
        loadComponent: () => import('@app/layout/not-found/not-found.component').then((c) => c.NotFoundComponent)
      }
    ]
  }


];
