import {AbstractControl, ValidatorFn, Validators} from '@angular/forms';

import { validateBr, utilsBr } from 'js-brasil';

/**
 * Validate input value is an CPF valid
 * @param control {@link AbstractControl}
 * @return An object or null
 */
export const cpf: ValidatorFn = (control: AbstractControl): Record<string, boolean> | null => {
  if (utilsBr.isPresent(Validators.required(control))) {
    return null;
  }
  const v: string = control.value;
  return validateBr['cpf'](v) ? null : {cpf: true};
};
