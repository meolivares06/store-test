import {Routes} from '@angular/router';
import {SellComponent} from '@feat/sell/sell/sell.component';
import {sellResolver} from '@feat/sell/resolver/sell.resolver';
import {clientResolver} from '@feat/client/resolver/client.resolver';
import {productResolver} from '@feat/product/resolver/product.resolver';

export const SellRoutes: Routes = [
  {
    path: '', component: SellComponent, resolve: { data: sellResolver, clients: clientResolver, products: productResolver }
  }
];
