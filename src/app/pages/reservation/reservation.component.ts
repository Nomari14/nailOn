import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { Reserved } from '../../shared/models/Reserved';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { Router, RouterLink } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { map } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-reservation',
  providers:[
  { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' }, ],
  imports: [
    MatDatepickerModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTimepickerModule,
    MatCardModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatNativeDateModule
  ], 
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit{
  reservationForm!: FormGroup;
  reservations: Reserved[] = [];
  isLoading = false;
  isLoggedIn= false;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {}

  
    ngOnInit(): void {
      this.authSubscription = this.authService.currentUser.subscribe(user => {
        this.isLoggedIn = !!user;
        localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
      });
      this.initializeForm();
      //this.loadReservations();
    }
  
    ngOnDestroy(): void {
      this.authSubscription?.unsubscribe();
    }
    initializeForm(): void {
    this.reservationForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['0 Ft', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  addReservation(): void {
    if (this.isLoggedIn){
    if (this.reservationForm.valid) {
      this.isLoading = true;
      const formValue = this.reservationForm.value;

      const date: Date = formValue.date; 
      const time: Date = formValue.time; 

      const combinedDate = new Date(date);
      combinedDate.setHours(time.getHours()+2);
      combinedDate.setMinutes(time.getMinutes());

      const formattedDateTime = this.reservationService.formatDateToString(combinedDate);
      const newReservation: Omit<Reserved, 'id'> = {
        name: formValue.name.split(":")[0],
        price: formValue.name.split(":")[1],
        datetime: formattedDateTime,
      };
      

      this.reservationService.addReservation(newReservation)
        .then(addedReservation => {
          console.log('New reservation added', addedReservation);
          this.reservationForm.reset();
          this.showNotification('Sikeres foglalás', 'success');
        })
        .catch(error => {
          console.error('Error adding reservation:', error);
          this.showNotification('Sikertelen foglalás', 'error');
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      Object.keys(this.reservationForm.controls).forEach(key => {
        const control = this.reservationForm.get(key);
        control?.markAsTouched();
      });
      this.showNotification('Kérjük, töltsön ki minden mezőt', 'error');
    }
  }
    else{
     this.showNotification('Bejelentkezés szükséges', 'error');
    }
  }
  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`]
    });
  }

}

export class Datepicker {}

export class Timepicker {}


