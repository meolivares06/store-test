import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientComponent {

}
