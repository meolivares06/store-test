import {Routes} from '@angular/router';
import {clientResolver} from '@feat/client/resolver/client.resolver';
import {ClientComponent} from '@feat/client/client/client.component';

export const ClientRoutes: Routes = [
  {
    path: '', component: ClientComponent, resolve: { data: clientResolver }
  }
];
