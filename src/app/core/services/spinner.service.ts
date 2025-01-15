import {inject, Injectable} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  loading = true;
  router = inject(Router);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed())
      .subscribe((routerEvent) => {
        this.checkRouterEvent(routerEvent as RouterEvent);
      });
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
      console.log('starting.');
    }

    if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
      this.loading = false;
      console.log('done.');
    }
  }
}
