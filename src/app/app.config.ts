import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
// import {provideAnimations} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { errorInterceptor } from '@app/core/interceptors/error.interceptor';
import { MessageService } from 'primeng/api';
import { GlobalErrorHandler } from '@app/core/errors/global-error-handler';
import { serverErrorInterceptor } from '@app/core/interceptors/server-error.interceptor';
import { globalErrorsInterceptor } from '@app/core/interceptors/global-errors.interceptor';
import { BASE_URL_TOKEN } from './app.tokens';

const firebaseConfig = {
  apiKey: 'AIzaSyCqLhuQMte_BjitDgsyD6BtplCReZQM9ik',
  authDomain: 'store-test-73501.firebaseapp.com',
  projectId: 'store-test-73501',
  storageBucket: 'store-test-73501.appspot.com',
  messagingSenderId: '623104895953',
  appId: '1:623104895953:web:f9dab1e0831427c35f4ef0',
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        /*errorInterceptor*/ /*serverErrorInterceptor*/ globalErrorsInterceptor,
      ]),
    ),
    provideRouter(routes) /*provideClientHydration(),*/,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    MessageService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
      deps: [MessageService],
    },
    {
      provide: BASE_URL_TOKEN,
      useValue: 'https://api.escuelajs.co/api/v1/api',
    },
  ],
};
