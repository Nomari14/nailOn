import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/User';
import { Reserved } from '../models/Reserved';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  getUserProfile(): Observable<{
    user: User | null,
    reservations: Reserved[],
  }> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of({
            user: null,
            reservations: [],
          });
        }

        return from(this.fetchUserWithReservations(authUser.uid));
      })
    );
  }

  private async fetchUserWithReservations(userId: string): Promise<{
    user: User | null,
    reservations: Reserved[],
  }> {
    try {
      const userDocRef = doc(this.firestore, 'Users', userId);
      const userSnapshot = await getDoc(userDocRef);
      
      if (!userSnapshot.exists()) {
        return {
          user: null,
          reservations: [],
        };
      }

      const userData = userSnapshot.data() as User;
      const user = { ...userData, id: userId };
      
      if (!user.reservations || user.reservations.length === 0) {
        return {
          user,
          reservations: [],
        };
      }

      const reservationsCollection = collection(this.firestore, 'Reservations');
      const q = query(reservationsCollection, where('id', 'in', user.reservations));
      const reservationsSnapshot = await getDocs(q);
      
      const reservations: Reserved[] = [];
      reservationsSnapshot.forEach(doc => {
        reservations.push({ ...doc.data(), id: doc.id } as Reserved);
      });
  
      const sortedReservations = reservations.sort((a, b) => {
      return a.datetime.localeCompare(b.datetime);
      });

      return {
        user,
        reservations: sortedReservations
      };
      
    } catch (error) {
      console.error('Hiba a felhasználói adatok betöltése során:', error);
      return {
        user: null,
        reservations: [],
      };
    }
  }
}