import {ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, NgTemplateOutlet} from '@angular/common';

import {Button} from 'primeng/button';
import {ConfirmationService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

import {cols} from '@feat/client/client.data';
import {TableRowDirective} from '@app/shared/components/datatable/directives/table-row.directive';
import {RowTemplatePipe} from '@app/shared/components/datatable/pipes/row-template.pipe';
import {CepPipe, CpfCnpjPipe} from '@app/core/pipes/';
import {StoreService} from '@app/shared/components/base-crud/basecrud.model';


/** Generic component for tables
 * Admits custom renderers by setting ng-template for each cell */
@Component({
    selector: 'app-datatable',
    imports: [
        Button,
        PrimeTemplate,
        TableModule,
        RowTemplatePipe,
        NgTemplateOutlet,
        DecimalPipe,
        DatePipe,
        CepPipe,
        CpfCnpjPipe,
        CurrencyPipe
    ],
    templateUrl: './datatable.component.html',
    styleUrl: './datatable.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatatableComponent {

  @Input() value: any[] = [];
  @Input() cols = cols;
  @Input() title = '';
  @Input() dialogService: DialogService;
  @Input() confirmationService: ConfirmationService;
  @Input() ref: DynamicDialogRef | undefined;
  @Input() storeService: StoreService<any>;
  @Input() action = true;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onCreate = new EventEmitter<boolean>();
  @Output() onRefresh = new EventEmitter<any>();

  @ContentChildren(TableRowDirective) contentChildren!: QueryList<TableRowDirective>;
  selectedItem: any;
  @Input() showEditAction = true;
  @Input() showDeleteAction = true;
  @Input() showCreateAction = true;
  @Input() showRefreshAction = true;
  @Input() pageSize = 15;

  createAction(): void {
    this.onCreate.emit(true);
  }

  deleteAction(rowData: any): void {
    this.onDelete.emit(rowData);
  }

  editAction(rowData: any): void {
    this.onEdit.emit(rowData);
  }

  refreshAction(): void {
    this.onRefresh.emit(true);
  }
}
