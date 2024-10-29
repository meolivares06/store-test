import { Routes } from '@angular/router';

export const layoutRoutes: Routes = [
  {path: '', redirectTo: '/client', pathMatch: 'full'},
  {
    path: '',
    loadComponent: () => import('@app/layout/layout.component').then(c => c.LayoutComponent)
  },

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
      }


];
