import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {firstValueFrom, of, switchMap} from 'rxjs';
import {SellStoreService} from '@feat/sell/services/sell-store.service';
import {Sell} from '@feat/sell/sell.model';

export const sellResolver: ResolveFn<Sell[]> = (route, state) => {
  const store = inject(SellStoreService);

  if (store.list().length > 0) {
    return store.list();
  } else {
    return firstValueFrom(of([]).pipe(
      switchMap(() => store.getFirebase())
    ));
  }
};
