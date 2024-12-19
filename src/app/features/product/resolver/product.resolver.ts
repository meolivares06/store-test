import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {firstValueFrom, of, switchMap} from 'rxjs';
import {Product} from '@feat/product/product.model';
import {ProductStoreService} from '@feat/product/services/product-store.service';

export const productResolver: ResolveFn<Product[]> = (route, state) => {
  const store = inject(ProductStoreService);

  return firstValueFrom(of([]).pipe(
    switchMap(() => store.getFirebase()),
    catchError((error) => {
      console.error('Error al resolver datos:', error);
      return of([]); // Retorna un valor predeterminado en caso de error
    })
  ));
};
