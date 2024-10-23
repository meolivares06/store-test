import {ChangeDetectionStrategy, Component, inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {StoreService} from '@app/shared/components/base-crud/basecrud.model';
import {Column} from '@app/shared/components/datatable/datatable.model';

@Component({
  selector: 'app-base-crud',
  standalone: true,
  imports: [],
  templateUrl: './base-crud.component.html',
  styleUrl: './base-crud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseCrudComponent<T> implements OnDestroy {
  dialogService = inject(DialogService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  ref: DynamicDialogRef | undefined;

  store: StoreService<T>;
  subscriptions: Subscription[] = [];
  cols: Column[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onDelete(rowData: T) { throw new Error('not implemented'); }
  onCreate() { throw new Error('not implemented'); }
  onRefresh() { throw new Error('not implemented'); }
  onEdit(rowData: T) { throw new Error('not implemented'); }
}
