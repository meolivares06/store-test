import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-base-crud',
  standalone: true,
  imports: [],
  templateUrl: './base-crud.component.html',
  styleUrl: './base-crud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseCrudComponent implements OnDestroy{
  ref: DynamicDialogRef | undefined;
  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
