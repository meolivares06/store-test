import {ChangeDetectionStrategy, Component, computed} from '@angular/core';
import {CardMobileComponent} from '@shared/components/datatable/components/card-mobile/card-mobile.component';
import {Client} from '@feat/client/client.model';
import {Card} from 'primeng/card';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-card-mobile-client',
  imports: [
    Card,
    DatePipe
  ],
  templateUrl: './card-mobile-client.component.html',
  styleUrl: './card-mobile-client.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardMobileClientComponent extends CardMobileComponent<Client> {
  code = computed(() => this.oneItem()?.code || '-');
  name = computed(() => this.oneItem()?.name || '-');
  birthday = computed(() => this.oneItem()?.birthday);

}