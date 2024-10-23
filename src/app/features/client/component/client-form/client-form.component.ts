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
    const {data} = this.dialogConfigService;

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

  ngOnInit(): void {

  }

  onSave(): void {
    // omit id on creation
    const {id, ...restProps} = this.form.getRawValue();
    !this.dialogConfigService?.data ?
        this.storeService.addFirebase(restProps).pipe(
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

  onAbort(): void {
    this.ref.close({data: null});
  }
}
