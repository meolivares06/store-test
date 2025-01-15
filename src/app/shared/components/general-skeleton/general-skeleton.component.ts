import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TableModule} from 'primeng/table';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
    selector: 'app-general-skeleton',
    imports: [
        TableModule,
        SkeletonModule
    ],
    templateUrl: './general-skeleton.component.html',
    styleUrl: './general-skeleton.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSkeletonComponent {
  fill = Array.from({ length: 5 }).map((_, i) => `Item #${i}`);
}
