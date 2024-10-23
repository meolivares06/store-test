import {Routes} from '@angular/router';
import {ClientListComponent} from '@feat/client/component/client-list/client-list.component';

export const ClientRoutes: Routes = [
  {
    path: '', component: ClientListComponent
  }
];
