import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CardMobileComponent} from '@shared/components/datatable/components/card-mobile/card-mobile.component';
import {Sell} from '@feat/sell/sell.model';
import {Card} from 'primeng/card';
import {CurrencyPipe, DatePipe, JsonPipe} from '@angular/common';
import {ClientStoreService} from '@feat/client/services/client-store.service';
import {ProductStoreService} from '@feat/product/services/product-store.service';

@Component({
  selector: 'app-card-mobile-sell',
  imports: [
    Card,
    JsonPipe,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './card-mobile-sell.component.html',
  styleUrl: './card-mobile-sell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardMobileSellComponent extends CardMobileComponent<Sell> {
  clientStoreService = inject(ClientStoreService);
  productStoreService = inject(ProductStoreService);

  total = computed(() => this.oneItem()?.total || 0);
  code = computed(() => this.oneItem()?.code || '-');
  creationDate = computed(() => this.oneItem()?.creationDate || '-');
  client = computed(() => this.clientStoreService.getById(this.oneItem()?.clientId)?.name ?? '-');
  product = computed(() => this.productStoreService.getById(this.oneItem()?.productId)?.name ?? '-');

}
