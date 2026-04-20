import {ChangeDetectionStrategy, Component, computed} from '@angular/core';
import {CardMobileComponent} from '@shared/components/datatable/components/card-mobile/card-mobile.component';
import {Product} from '@feat/product/product.model';
import {Card} from 'primeng/card';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-card-mobile-product',
  imports: [
    Card,
    CurrencyPipe
  ],
  templateUrl: './card-mobile-product.component.html',
  styleUrl: './card-mobile-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardMobileProductComponent extends CardMobileComponent<Product> {
  code = computed(() => this.oneItem()?.code || '-');
  name = computed(() => this.oneItem()?.name || '-');
  value = computed(() => this.oneItem()?.value || 0);

}