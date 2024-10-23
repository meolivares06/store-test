import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

import {MenuItem} from 'primeng/api';
import {Button} from 'primeng/button';

import {appTitle, menuData} from './layout.data';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    Button,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  title = appTitle;
  menuItems: MenuItem[] | undefined = menuData;
}
