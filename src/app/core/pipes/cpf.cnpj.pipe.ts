import {Pipe, PipeTransform} from '@angular/core';

import {maskBr} from 'js-brasil';

@Pipe({
  name: 'cpfCnpj',
  standalone: true
})
export class CpfCnpjPipe implements PipeTransform {

  /**
   * Transform input value in CPF or CNPJ format
   * @param value string or number
   * @return An string in format 999.999.999-99
   */
  transform(value: any): string {
    return value?.length === 11 ? maskBr['cpf'](value) : maskBr['cnpj'](value);
  }
}
