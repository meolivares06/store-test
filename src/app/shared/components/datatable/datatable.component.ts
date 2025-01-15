import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ContentChildren,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  QueryList,
  signal,
  Type,
  ViewContainerRef
} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, NgTemplateOutlet} from '@angular/common';
import {MediaMatcher} from '@angular/cdk/layout';


import {Button} from 'primeng/button';
import {ConfirmationService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

import {cols} from '@feat/client/client.data';
import {TableRowDirective} from '@app/shared/components/datatable/directives/table-row.directive';
import {RowTemplatePipe} from '@app/shared/components/datatable/pipes/row-template.pipe';
import {CepPipe, CpfCnpjPipe} from '@app/core/pipes/';
import {StoreService} from '@app/shared/components/base-crud/basecrud.model';
import {CardMobileComponent} from '@shared/components/datatable/components/card-mobile/card-mobile.component';


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
export class DatatableComponent implements OnInit {

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
  @Input() cardItem: Type<any>;

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;


  constructor(private viewContainer: ViewContainerRef) {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);

    this._mobileQueryListener = () => {
      this.isMobile.set(this._mobileQuery.matches);
      this.loadContent();
    };
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    if(this.isMobile()) {
      this.loadContent();
    }
  }
  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

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

  private loadContent() {
    this.value.forEach(item => {
      const cmpRef: ComponentRef<CardMobileComponent<typeof item>> = this.viewContainer.createComponent(this.cardItem);
      cmpRef.setInput('oneItem', item);
      cmpRef.changeDetectorRef.detectChanges();
    });
  }
  /*private getItemInstance(item: unknown): void {
    // Locate a DOM node that would be used as a host.
    const hostElement = document.getElementById('hello-component-host');
    // Get an `EnvironmentInjector` instance from the `ApplicationRef`.
      const environmentInjector = this.applicationRef.injector;
    // We can now create a `ComponentRef` instance.

    // @ts-ignore
    const componentRef = createComponent(this.cardItem, {hostElement, environmentInjector});
    // Last step is to register the newly created ref using the `ApplicationRef` instance
    // to include the component view into change detection cycles.
    this.applicationRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
  }*/
}
