import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {cpf} from '@app/core/validators/cpf.validator';
import {InputMaskModule} from 'primeng/inputmask';
import {CalendarModule} from 'primeng/calendar';
import {ClientFirebaseService} from '@feat/client/services/client-firebase.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {catchError, EMPTY} from 'rxjs';
import {ClientStoreService} from '@feat/client/services/client-store.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
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
export class ClientFormComponent implements OnInit {
  form: FormGroup;
  storeService = inject(ClientStoreService);
  ref = inject(DynamicDialogRef);
  dialogConfigService = inject(DynamicDialogConfig);

  constructor() {
    const {entity} = this.dialogConfigService?.data;

    this.form = new FormGroup({
      id: new FormControl(entity?.id, [Validators.required,]),
      code: new FormControl(entity?.code, [Validators.required,]),
      name: new FormControl(entity?.name, [Validators.required,]),
      cpf: new FormControl(entity?.cpf, [Validators.required, cpf]),
      address: new FormGroup({
        cep: new FormControl(entity?.address?.cep, [Validators.required,]),
        logradouro: new FormControl(entity?.address?.logradouro, [Validators.required,]),
        no: new FormControl(entity?.address?.no, [Validators.required,]),
        bairro: new FormControl(entity?.address?.bairro, [Validators.required,]),
        complemento: new FormControl(entity?.address?.complemento, [Validators.required,]),
        cidade: new FormControl(entity?.address?.cidade, [Validators.required,])
      }),
      email: new FormControl(entity?.email, [Validators.required, Validators.email]),
      birthday: new FormControl(entity?.birthday, [Validators.required])
    })
  }

  ngOnInit(): void {

  }

  onSave() {
    !this.dialogConfigService.data ?
        this.storeService.addFirebase(this.form.getRawValue()).pipe(
          catchError((error) => {
            this.ref.close({data: null, error});
            return EMPTY;
          })
        ).subscribe(r => {
          this.ref.close({data: {id:r, ...this.form.getRawValue()}});
        })
      :
        this.storeService.updateFirebase(this.form.getRawValue()).pipe(
          catchError((error) => {
            this.ref.close({data: null, error});
            return EMPTY;
          })
        ).subscribe(r => {
          this.ref.close({data: {id:r, ...this.form.getRawValue()}});
        });
  }

  onAbort() {
    this.ref.close({data: null});
  }
}
