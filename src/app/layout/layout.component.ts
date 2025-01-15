import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

import {MenuItem} from 'primeng/api';

import {appTitle, menuData} from './layout.data';
import {GeneralSkeletonComponent} from '@app/shared/components/general-skeleton/general-skeleton.component';
import {SpinnerService} from '@app/core/services/spinner.service';

@Component({
    selector: 'app-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    GeneralSkeletonComponent,
    RouterOutlet
  ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  spinnerService = inject(SpinnerService);

  title = appTitle;
  menuItems: MenuItem[] | undefined = menuData;
}
