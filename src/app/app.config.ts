import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), 
     provideFirebaseApp(() => 
      initializeApp({ 
        projectId: "nailon-fcfc4", 
        appId: "1:1030406790605:web:e0379e8bf6feb008d47884", 
        storageBucket: "nailon-fcfc4.firebasestorage.app", 
        apiKey: "AIzaSyBrpsIJ2-a02d2HsWSSL1i0XQtZo2KcUqs", 
        authDomain: "nailon-fcfc4.firebaseapp.com", 
        messagingSenderId: "1030406790605" })), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())]
};
