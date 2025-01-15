import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {BaseCrudComponent} from '@app/shared/components/base-crud/base-crud.component';
import {Product} from '@feat/product/product.model';
import {catchError, EMPTY, tap} from 'rxjs';
import {ProductStoreService} from '@feat/product/services/product-store.service';
import {cols} from '@feat/product/product.data';
import {ProductFormComponent} from '@feat/product/component/product-form/product-form.component';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DatatableComponent} from '@app/shared/components/datatable/datatable.component';
import {ToastModule} from 'primeng/toast';

@Component({
    selector: 'app-product-list',
  imports: [
    ConfirmDialogModule,
    DatatableComponent,
    ToastModule
  ],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DialogService, ConfirmationService, MessageService]
})
export class ProductListComponent extends BaseCrudComponent<Product>{
  override store = inject(ProductStoreService);
  override cols = cols;

  override onDelete(rowData: Product) {

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
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'Ciar novo cliente',
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

  override onEdit($event: Product) {
    this.ref = this.dialogService.open(ProductFormComponent, {
      data: $event,
      header: 'Update novo cliente',
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
