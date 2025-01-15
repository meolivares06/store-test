import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';


import {LayoutComponent} from '@app/layout/layout.component';
import {PrimeNG} from 'primeng/config';

@Component({
    selector: 'app-root',
    imports: [LayoutComponent, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
