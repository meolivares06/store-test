import { ChangeDetectionStrategy, Component } from '@angular/core';
import {SellListComponent} from '@feat/sell/component/sell-list/sell-list.component';

@Component({
    selector: 'app-sell',
    imports: [
        SellListComponent
    ],
    templateUrl: './sell.component.html',
    styleUrl: './sell.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellComponent {

}
