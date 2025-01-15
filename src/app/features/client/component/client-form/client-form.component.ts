import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {cpf} from '@app/core/validators/cpf.validator';
import {InputMaskModule} from 'primeng/inputmask';
import {CalendarModule} from 'primeng/calendar';
import {ClientStoreService} from '@feat/client/services/client-store.service';
import {BaseFormComponent} from '@app/shared/components/base-form/base-form.component';
import {Client} from '@feat/client/client.model';

@Component({
    selector: 'app-client-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    Button,
    InputMaskModule,
    CalendarModule
  ],
    templateUrl: './client-form.component.html',
    styleUrl: './client-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientFormComponent extends BaseFormComponent<Client> {
  override storeService= inject(ClientStoreService);

  constructor() {
    super();
  }

  override initForm(data?: any): void {
    this.form = new FormGroup({
      id: new FormControl(data?.id),
      code: new FormControl(data?.code, [Validators.required,]),
      name: new FormControl(data?.name, [Validators.required,]),
      cpf: new FormControl(data?.cpf, [Validators.required, cpf]),
      address: new FormGroup({
        cep: new FormControl(data?.address?.cep, [Validators.required,]),
        logradouro: new FormControl(data?.address?.logradouro, [Validators.required,]),
        no: new FormControl(data?.address?.no, [Validators.required,]),
        bairro: new FormControl(data?.address?.bairro, [Validators.required,]),
        complemento: new FormControl(data?.address?.complemento, [Validators.required,]),
        cidade: new FormControl(data?.address?.cidade, [Validators.required,])
      }),
      email: new FormControl(data?.email, [Validators.required, Validators.email]),
      birthday: new FormControl(data?.birthday, [Validators.required])
    })
  }
}
