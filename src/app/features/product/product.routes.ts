import {Routes} from '@angular/router';
import {ProductComponent} from '@feat/product/product/product.component';
import {productResolver} from '@feat/product/resolver/product.resolver';

export const ProductRoutes: Routes = [
  {
    path: '', component: ProductComponent, resolve: { data: productResolver }
  }
];
