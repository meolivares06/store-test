import { ChangeDetectionStrategy, Component } from '@angular/core';
import {ProductListComponent} from '@feat/product/component/product-list/product-list.component';

@Component({
    selector: 'app-product',
    imports: [
        ProductListComponent
    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {

}
