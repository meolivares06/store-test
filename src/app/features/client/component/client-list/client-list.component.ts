import {ChangeDetectionStrategy, Component, inject, OnDestroy} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {catchError, EMPTY, Subscription, tap} from 'rxjs';

import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';

import {cols} from '@feat/client/client.data';
import {ClientFormComponent} from '@feat/client/component/client-form/client-form.component';
import {DatatableComponent} from '@app/shared/components/datatable/datatable.component';
import {TableRowDirective} from '@app/shared/components/datatable/directives/table-row.directive';
import {CepPipe} from '@app/core/pipes';
import {ClientStoreService} from '@feat/client/services/client-store.service';


@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    TableModule,
    JsonPipe,
    Button,
    DatatableComponent,
    TableRowDirective,
    CepPipe,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, ConfirmationService, MessageService]
})
export class ClientListComponent implements OnDestroy {
  store = inject(ClientStoreService);
  dialogService = inject(DialogService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  cols = cols;


  ref: DynamicDialogRef | undefined;
  subscriptions: Subscription[] = [];

  onDelete(rowData: any) {

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

  onCreate(event: any): void {
    this.ref = this.dialogService.open(ClientFormComponent, {
      header: 'Ciar novo cliente',
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
    this.ref.onClose.subscribe(r => {
      const {data, error} = r;
      if (data) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Executed succefully' })
      }
      if (error) {
        this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Process failed' })
      }
    })
  }

  onRefresh($event: any) {
    this.subscriptions.push(
      this.store.refresh().subscribe()
    );
  }

  onEdit($event: any) {
    this.ref = this.dialogService.open(ClientFormComponent, {
      data: {
        entity: $event
      },
      header: 'Update novo cliente',
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
    this.ref.onClose.subscribe(r => {
      const {data, error} = r;
      if (data) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Executed succefully' })
      }
      if (error) {
        this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Process failed' })
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
