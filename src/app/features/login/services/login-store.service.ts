import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/components/base-crud/basecrud.model';

@Injectable({
  providedIn: 'root',
})
export class LoginStoreService {
  private state: { username: string; password: string } = {
    username: '',
    password: '',
  };
  constructor() {}
}
