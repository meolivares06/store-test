import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-card-mobile',
  imports: [],
  templateUrl: './card-mobile.component.html',
  styleUrl: './card-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardMobileComponent<T> {
  oneItem = input<T>();
}
