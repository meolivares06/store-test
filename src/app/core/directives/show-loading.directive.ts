import {Directive, ElementRef, Input, Renderer2, SimpleChanges} from '@angular/core';
import {BlockUI} from 'primeng/blockui';

@Directive({
  selector: '[appShowLoading]',
  standalone: true
})
export class ShowLoadingDirective {
  @Input('appShowLoading') blocked: boolean = true;
  private blockUI: BlockUI;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Crear dinámicamente el componente BlockUI
    this.blockUI = this.renderer.createElement('p-blockUI') as BlockUI;
    this.renderer.appendChild(this.el.nativeElement, this.blockUI); // Añadir BlockUI al contenedor
    this.blockUI.target = 'formRef';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blocked']) {
      if (this.blocked) {
        this.showBlockUI();
      } else {
        this.hideBlockUI();
      }
    }
  }

  private showBlockUI() {
    this.blockUI.blocked = true;  // Bloquea el contenido
  }

  private hideBlockUI() {
    this.blockUI.blocked = false;  // Desbloquea el contenido
  }
}
