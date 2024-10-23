import {ChangeDetectionStrategy, Component, effect, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {catchError, EMPTY, of, shareReplay, switchAll, switchMap} from 'rxjs';
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
export class SellFormComponent implements OnInit {
  form: FormGroup;
  storeService = inject(SellStoreService);
  ref = inject(DynamicDialogRef);
  dialogConfigService = inject(DynamicDialogConfig);
  clientStoreService = inject(ClientStoreService);
  productStoreService = inject(ProductStoreService);
  clientList: Client[] = [];
  productList: Product[] = [];
  fillClientList = effect(() => this.clientList = this.clientStoreService.list())
  fillProductList = effect(() => this.productList = this.productStoreService.list())

  constructor() {
    const {data} = this.dialogConfigService;

    this.form = new FormGroup({
      id: new FormControl(data?.id),
      code: new FormControl(data?.code, [Validators.required,]),
      creationDate: new FormControl(data?.creationDate, [Validators.required,]),
      clientId: new FormControl(data?.clientId, [Validators.required,]),
      productId: new FormControl(data?.productId, [Validators.required,]),
      total: new FormControl(data?.total, [Validators.required]),
    });
    of(EMPTY).pipe(
      switchMap(() => this.clientStoreService.getFirebase()),
      shareReplay(),
      takeUntilDestroyed()
    ).subscribe();

    of(EMPTY).pipe(
      switchMap(() => this.productStoreService.getFirebase()),
      shareReplay(),
      takeUntilDestroyed()
    ).subscribe();
  }

  ngOnInit(): void {

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
