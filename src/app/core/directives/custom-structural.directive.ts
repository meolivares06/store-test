import {Directive, effect, inject, input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appCustomStructural]',
  standalone: true
})
export class CustomStructuralDirective {
  tmplRef = inject(TemplateRef);
  viewContainerRef = inject(ViewContainerRef);

  showIfAdmin = input(false);
  myEffect = effect(() => {
    if(this.showIfAdmin()) {
      this.viewContainerRef.createEmbeddedView(this.tmplRef);
    } else {
      this.viewContainerRef.clear();
    }
  });
  constructor() {}

}

/* How to use
<ng-template appCustomStructural [showIfAdmin]="admin">
  <p>Is Admin</p>
  <p>content for admins</p>
</ng-template>
<button class="p-button" (click)="admin = !admin"></button>
* */
