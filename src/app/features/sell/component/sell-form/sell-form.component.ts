import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SellStoreService} from '@feat/sell/services/sell-store.service';
import {Button} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {CalendarModule} from 'primeng/calendar';
import {Client} from '@feat/client/client.model';
import {Product} from '@feat/product/product.model';
import {BaseFormComponent} from '@app/shared/components/base-form/base-form.component';
import {Sell} from '@feat/sell/sell.model';
import {ClientStoreService} from '@feat/client/services/client-store.service';
import {ProductStoreService} from '@feat/product/services/product-store.service';

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
export class SellFormComponent extends BaseFormComponent<Sell> implements OnInit {
  override storeService = inject(SellStoreService);
  clientStoreService = inject(ClientStoreService);
  productStoreService = inject(ProductStoreService);

  clientList: Client[] = [];
  productList: Product[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.clientList = this.clientStoreService.list();
    this.productList = this.productStoreService.list();
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
  }

  // another approach for loading the data from the others modules
  // requestOthersData(): void {
  //   of(EMPTY).pipe(
  //     switchMap(() => this.clientStoreService.getFirebase()),
  //     shareReplay(),
  //     takeUntilDestroyed()
  //   ).subscribe();
  //
  //   of(EMPTY).pipe(
  //     switchMap(() => this.productStoreService.getFirebase()),
  //     shareReplay(),
  //     takeUntilDestroyed()
  //   ).subscribe();
  // }
}
