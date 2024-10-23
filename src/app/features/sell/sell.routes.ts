import {Routes} from '@angular/router';
import {SellComponent} from '@feat/sell/sell/sell.component';
import {sellResolver} from '@feat/sell/resolver/sell.resolver';

export const SellRoutes: Routes = [
  {
    path: '', component: SellComponent, resolve: { data: sellResolver }
  }
];
