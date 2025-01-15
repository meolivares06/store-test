import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductStoreService} from '@feat/product/services/product-store.service';
import {Button} from 'primeng/button';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {BaseFormComponent} from '@app/shared/components/base-form/base-form.component';
import {Product} from '@feat/product/product.model';
import {InputNumber} from 'primeng/inputnumber';

@Component({
    selector: 'app-product-form',
  imports: [
    Button,
    InputMaskModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    InputNumber
  ],
    templateUrl: './product-form.component.html',
    styleUrl: './product-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent  extends BaseFormComponent<Product> {
  override storeService = inject(ProductStoreService);

  constructor() {
    super();
  }

  override initForm(data?: any) {
    this.form = new FormGroup({
      id: new FormControl(data?.id),
      code: new FormControl(data?.code, [Validators.required,]),
      name: new FormControl(data?.name, [Validators.required,]),
      value: new FormControl(data?.value, [Validators.required]),
    })
  }
}
