import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BaseCrudComponent} from '@app/shared/components/base-crud/base-crud.component';
import {Sell} from '@feat/sell/sell.model';
import {catchError, EMPTY, of, shareReplay, switchMap, tap} from 'rxjs';
import {SellStoreService} from '@feat/sell/services/sell-store.service';
import {cols} from '@feat/sell/sell.data';
import {SellFormComponent} from '@feat/sell/component/sell-form/sell-form.component';
import {ToastModule} from 'primeng/toast';
import {DatatableComponent} from '@app/shared/components/datatable/datatable.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableRowDirective} from '@app/shared/components/datatable/directives/table-row.directive';
import {ClientStoreService} from '@feat/client/services/client-store.service';
import {ProductStoreService} from '@feat/product/services/product-store.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
    selector: 'app-sell-list',
  imports: [
    ToastModule,
    DatatableComponent,
    ConfirmDialogModule,
    TableRowDirective
  ],
    templateUrl: './sell-list.component.html',
    styleUrl: './sell-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DialogService, ConfirmationService, MessageService]
})
export class SellListComponent extends BaseCrudComponent<Sell> {
  override store = inject(SellStoreService);
  clientStoreService = inject(ClientStoreService);
  productStoreService = inject(ProductStoreService);

  override cols = cols;

  constructor() {
    super();
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

  override onDelete(rowData: Sell) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.push(
          this.store.deleteFirebase(rowData).pipe(
            tap(() => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Executed succefully' })),
            catchError(() => {
              this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Process failed' });
              return EMPTY;
            }),
          ).subscribe()
        );
      },
      reject: () => {
        console.log('nothing')
      }
    });

  }

  override onCreate(): void {
    this.ref = this.dialogService.open(SellFormComponent, {
      header: 'Ciar nova venda',
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
    this.ref.onClose.subscribe(r => {
      if(r) {
        const {data, error} = r;
        if (data) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Executed succefully' })
        }
        if (error) {
          this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Process failed' })
        }
      }
    })
  }

  override onRefresh() {
    this.subscriptions.push(
      this.store.refresh().subscribe()
    );
  }

  override onEdit($event: Sell) {
    this.ref = this.dialogService.open(SellFormComponent, {
      data: $event,
      header: 'Update venda',
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
    this.ref.onClose.subscribe(r => {
      if(r) {
        const {data, error} = r;
        if (data) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Executed succefully' })
        }
        if (error) {
          this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Process failed' })
        }
      }

    })
  }

}
