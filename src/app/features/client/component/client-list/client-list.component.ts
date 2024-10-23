import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {ClientHttpService} from '@feat/client/services/client.http.service';
import {cols} from '@feat/client/client.data';
import {Button} from 'primeng/button';
import {LazyLoadEvent} from 'primeng/api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    TableModule,
    JsonPipe,
    Button
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientListComponent implements OnInit, OnDestroy {
  httpService = inject(ClientHttpService);

  list = signal<any>(null);
  cols = cols;
  totalRecords!: number;

  loading: boolean = false;

  subscriptions: Array<Subscription> = [];
  ngOnInit(): void {
    this.loading = true;
    // this.httpService.getProducts().then(p => this.list.set(p));
  }

  loadData(event: TableLazyLoadEvent) {
    console.warn(event);
    this.loading = true;
    this.subscriptions.push(
      this.httpService.loadAllPaginated(event).subscribe((res) => {
        this.list.set(res);
        this.totalRecords = res.length;
        this.loading = false;
      })
    );
  }

  select(rowData: any) {
    console.log(rowData);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
