import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {firstValueFrom, of, switchMap} from 'rxjs';

import {ClientStoreService} from '@feat/client/services/client-store.service';
import {Client} from '@feat/client/client.model';

export const clientResolver: ResolveFn<Client[]> = () => {
  const store = inject(ClientStoreService);

  if(store.list().length > 0) {
    return store.list();
  } else {
    return firstValueFrom(of([]).pipe(
      switchMap(() => store.getFirebase())
    ));
  }
};
