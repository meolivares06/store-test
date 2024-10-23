import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {catchError, EMPTY} from 'rxjs';
import {ProductStoreService} from '@feat/product/services/product-store.service';
import {Button} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    Button,
    CalendarModule,
    InputMaskModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent {
  form: FormGroup;
  storeService = inject(ProductStoreService);
  ref = inject(DynamicDialogRef);
  dialogConfigService = inject(DynamicDialogConfig);

  constructor() {
    const {data} = this.dialogConfigService;

    this.form = new FormGroup({
      id: new FormControl(data?.id),
      code: new FormControl(data?.code, [Validators.required,]),
      name: new FormControl(data?.name, [Validators.required,]),
      value: new FormControl(data?.value, [Validators.required]),
    })
  }

  onSave(): void {
    // omit id on creation
    const {id, ...restProps} = this.form.getRawValue();
    !this.dialogConfigService?.data ?
      this.storeService.addFirebase(restProps).pipe(
        catchError((error) => {
          this.ref.close({data: null, error});
          return EMPTY;
        })
      ).subscribe(r => {
        this.ref.close({data: {id:r, ...this.form.getRawValue()}});
      })
      :
      this.storeService.updateFirebase(this.form.getRawValue()).pipe(
        catchError((error) => {
          this.ref.close({data: null, error});
          return EMPTY;
        })
      ).subscribe(r => {
        this.ref.close({data: {id:r, ...this.form.getRawValue()}});
      });
  }

  onAbort() {
    this.ref.close({data: null});
  }
}
