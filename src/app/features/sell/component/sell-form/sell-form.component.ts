import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EMPTY, of, shareReplay, switchMap} from 'rxjs';
import {SellStoreService} from '@feat/sell/services/sell-store.service';
import {Button} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {CalendarModule} from 'primeng/calendar';
import {ClientStoreService} from '@feat/client/services/client-store.service';
import {Client} from '@feat/client/client.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Product} from '@feat/product/product.model';
import {ProductStoreService} from '@feat/product/services/product-store.service';
import {BaseFormComponent} from '@app/shared/components/base-form/base-form.component';
import {Sell} from '@feat/sell/sell.model';

@Component({
  selector: 'app-sell-form',
  standalone: true,
  imports: [
    Button,
    InputNumberModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  templateUrl: './sell-form.component.html',
  styleUrl: './sell-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellFormComponent extends BaseFormComponent<Sell> {
  override storeService = inject(SellStoreService);
  clientStoreService = inject(ClientStoreService);
  productStoreService = inject(ProductStoreService);
  clientList: Client[] = [];
  productList: Product[] = [];
  fillClientList = effect(() => this.clientList = this.clientStoreService.list())
  fillProductList = effect(() => this.productList = this.productStoreService.list())

  constructor() {
    super();
  }

  override initForm(data?: any) {
    this.form = new FormGroup({
      id: new FormControl(data?.id),
      code: new FormControl(data?.code, [Validators.required,]),
      creationDate: new FormControl(data?.creationDate, [Validators.required,]),
      clientId: new FormControl(data?.clientId, [Validators.required,]),
      productId: new FormControl(data?.productId, [Validators.required,]),
      total: new FormControl(data?.total, [Validators.required]),
    });
    if (this.clientStoreService) {
      of(EMPTY).pipe(
        switchMap(() => this.clientStoreService.getFirebase()),
        shareReplay(),
        takeUntilDestroyed()
      ).subscribe();
    } else {
      console.warn('ClientStoreService not initialized')
    }

    if (this.productStoreService) {
      of(EMPTY).pipe(
      switchMap(() => this.productStoreService.getFirebase()),
      shareReplay(),
      takeUntilDestroyed()
    ).subscribe();
  } else {
  console.warn('ClientStoreService not initialized')
}
  }
}
