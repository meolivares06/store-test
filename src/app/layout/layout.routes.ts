import { Routes } from '@angular/router';
import {sellResolver} from '@feat/sell/resolver/sell.resolver';
import {clientResolver} from '@feat/client/resolver/client.resolver';
import {productResolver} from '@feat/product/resolver/product.resolver';

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
        path: 'mockdata',
        resolve: { data: sellResolver, clients: clientResolver, products: productResolver },
        loadComponent: () => import('@shared/mockdata/mockdata.component').then(c => c.MockdataComponent),
      },
      {
        path: 'not-found',
        loadComponent: () => import('@app/layout/not-found/not-found.component').then((c) => c.NotFoundComponent)
      }
    ]
  }


];
