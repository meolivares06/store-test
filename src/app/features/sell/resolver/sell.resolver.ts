import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {firstValueFrom, of, switchMap} from 'rxjs';
import {SellStoreService} from '@feat/sell/services/sell-store.service';
import {Sell} from '@feat/sell/sell.model';

export const sellResolver: ResolveFn<Sell[]> = (route, state) => {
  const store = inject(SellStoreService);

  return firstValueFrom(of([]).pipe(
    switchMap(() => store.getFirebase()),
    catchError((error) => {
      console.error('Error al resolver datos:', error);
      return of([]); // Retorna un valor predeterminado en caso de error
    })
  ));
};
