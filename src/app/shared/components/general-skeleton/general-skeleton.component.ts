import { ChangeDetectionStrategy, Component } from '@angular/core';
import {TableModule} from 'primeng/table';
import {SkeletonModule} from 'primeng/skeleton';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-general-skeleton',
  standalone: true,
  imports: [
    TableModule,
    SkeletonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    Button
  ],
  templateUrl: './general-skeleton.component.html',
  styleUrl: './general-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSkeletonComponent {
  fill = Array.from({ length: 5 }).map((_, i) => `Item #${i}`);
}
