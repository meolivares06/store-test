import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {catchError, EMPTY} from 'rxjs';
import {StoreService} from '@app/shared/components/base-crud/basecrud.model';


@Component({
  selector: 'app-base-form',
  standalone: true,
  imports: [],
  templateUrl: './base-form.component.html',
  styleUrl: './base-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseFormComponent<T> {
  form: FormGroup;
  ref = inject(DynamicDialogRef);
  dialogConfigService = inject(DynamicDialogConfig);


  storeService: StoreService<T>;

  constructor() {
    this.initForm(this.dialogConfigService?.data);
  }

  initForm(data?: any): void {
    throw new Error('Init form must be implemented');
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
