import {Pipe, PipeTransform} from '@angular/core';

import { maskBr } from 'js-brasil';

@Pipe({
  name: 'cep',
  standalone: true
})
export class CepPipe implements PipeTransform {

  /**
   * Transform input value in CEP format
   * @param value string or number
   * @return An string in format 99999-999
   */
  transform(value: any): string {
    return maskBr['cep'](value);
  }
}
