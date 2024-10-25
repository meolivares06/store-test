import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
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
import {ActivatedRoute} from '@angular/router';

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

  route = inject(ActivatedRoute)
  clientList: Client[] = [];
  productList: Product[] = [];

  constructor() {
    super();
    this.clientList = this.route.snapshot.data['clients'];
    this.productList = this.route.snapshot.data['products'];
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
}
