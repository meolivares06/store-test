import { Inject, Injectable } from '@angular/core';
import { BASE_URL_TOKEN } from '@app/app.tokens';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  constructor(@Inject(BASE_URL_TOKEN) private baseUrl: string) {}
}
