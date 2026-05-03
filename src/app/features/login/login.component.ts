import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginStoreService } from './services/login-store.service';

@Component({
  selector: 'app-login',
  template: `<div class="login-container">
    <h2>Login</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" formControlName="username" type="text" />

        @if (
          loginForm.get('username')?.invalid &&
          loginForm.get('username')?.touched
        ) {
          <div class="error">Username is required.</div>
        }
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" formControlName="password" type="password" />
        @if (
          loginForm.get('password')?.invalid &&
          loginForm.get('password')?.touched
        ) {
          <div class="error">Password is required.</div>
        }
      </div>
      <button type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
  </div>`,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  private readonly loginStoreService = inject(LoginStoreService);
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    console.log('LoginComponent', this.loginForm.value);
  }
}
