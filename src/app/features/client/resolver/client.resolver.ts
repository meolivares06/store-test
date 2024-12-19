import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {firstValueFrom, of, switchMap} from 'rxjs';

import {ClientStoreService} from '@feat/client/services/client-store.service';
import {Client} from '@feat/client/client.model';

export const clientResolver: ResolveFn<Client[]> = (route, state) => {
  const clientStore = inject(ClientStoreService);

  return firstValueFrom(of([]).pipe(
    switchMap(() => clientStore.getFirebase()),
    catchError((error) => {
      console.error('Error al resolver datos:', error);
      return of([]); // Retorna un valor predeterminado en caso de error
    })
  ));
};
