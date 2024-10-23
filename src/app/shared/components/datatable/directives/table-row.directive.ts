import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[tableRow]',
  standalone: true
})
export class TableRowDirective {
  private templateName!: string;

  constructor(private templateRef: TemplateRef<any>) {
  }

  get template(): TemplateRef<any> {
    return this.templateRef;
  }

  get name(): string {
    return this.templateName;
  }

  @Input({required: true}) set tableRow(name: string) {
    this.templateName = name;
  }

}
