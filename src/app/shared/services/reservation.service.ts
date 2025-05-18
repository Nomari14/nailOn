import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, where } from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom } from 'rxjs';
import { Reserved } from '../models/Reserved';
import { AuthService } from './auth.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly RESERVATIONS_COLLECTION = 'Reservations';
  private readonly USERS_COLLECTION = 'Users';

  constructor(
    private authService: AuthService,
    private firestore: Firestore      
  ) { }

  formatDateToString(date: Date | string): string {
    const format = (isoString: string) =>{
        const [day, time] = isoString.split('T');
        const [hours, minutes] = time.split(':');
        return `${day} ${hours}:${minutes}`;
    }
    if (typeof date === 'string') {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return format(new Date().toISOString());
      }
      return date.includes('T') ? format(date): date;
    }
    if (date instanceof Date) {
      return format(date.toISOString());
    }
    return format(new Date().toISOString());
  }
  
  async addReservation(reservation: Omit<Reserved, 'id'>): Promise<Reserved> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const reservationsCollection = collection(this.firestore, this.RESERVATIONS_COLLECTION);
      
      const reservationToSave = {
        ...reservation,
      };
      
      const docRef = await addDoc(reservationsCollection, reservationToSave);
      const reservationId = docRef.id;
      
      await updateDoc(docRef, { id: reservationId });
      
      const newReservation = {
        ...reservationToSave,
        id: reservationId
      } as Reserved;

      const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const reservations = userData.reservations || [];
        reservations.push(reservationId);
        await updateDoc(userDocRef, { reservations });
      }

      return newReservation;
    } catch (error) {
      console.error('Error adding reservation:', error);
      throw error;
    }
  }

  async deleteReservation(reservationId: string): Promise<void> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }
      const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      const userData = userDoc.data() as User;
      if (!userData.reservations || !userData.reservations.includes(reservationId)) {
        throw new Error('Reservation does not belong to the user');
      }

      const reservationDocRef = doc(this.firestore, this.RESERVATIONS_COLLECTION, reservationId);
      await deleteDoc(reservationDocRef);

      const updatedReservations = userData.reservations.filter(id => id !== reservationId);
      return updateDoc(userDocRef, { reservations: updatedReservations });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }

}