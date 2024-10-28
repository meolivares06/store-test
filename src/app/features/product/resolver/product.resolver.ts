import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {firstValueFrom, of, switchMap} from 'rxjs';
import {Product} from '@feat/product/product.model';
import {ProductStoreService} from '@feat/product/services/product-store.service';

export const productResolver: ResolveFn<Product[]> = (route, state) => {
  const store = inject(ProductStoreService);

  if(store.list().length > 0) {
    return store.list();
  } else {
    return firstValueFrom(of([]).pipe(
      switchMap(() => store.getFirebase())
    ));
  }
};
