import { ChangeDetectionStrategy, Component } from '@angular/core';
import {ClientListComponent} from '@feat/client/component/client-list/client-list.component';

@Component({
    selector: 'app-client',
    imports: [
        ClientListComponent
    ],
    templateUrl: './client.component.html',
    styleUrl: './client.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientComponent {
}
