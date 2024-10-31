import {ChangeDetectionStrategy, Component, Input, input} from '@angular/core';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@Component({
  selector: 'app-local-spinner',
  standalone: true,
    imports: [
        BlockUIModule,
        ProgressSpinnerModule
    ],
  templateUrl: './local-spinner.component.html',
  styleUrl: './local-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalSpinnerComponent {
  @Input() elementRef!: any;
  @Input() loading!: boolean;

}
