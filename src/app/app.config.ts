import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withFetch} from '@angular/common/http';

import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';

import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';

const firebaseConfig = {
  apiKey: "AIzaSyCqLhuQMte_BjitDgsyD6BtplCReZQM9ik",
  authDomain: "store-test-73501.firebaseapp.com",
  projectId: "store-test-73501",
  storageBucket: "store-test-73501.appspot.com",
  messagingSenderId: "623104895953",
  appId: "1:623104895953:web:f9dab1e0831427c35f4ef0"
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes), /*provideClientHydration(),*/
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAnimations()
  ]
};
