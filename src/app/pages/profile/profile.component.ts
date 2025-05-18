import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription} from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';
import { Reserved } from '../../shared/models/Reserved';
import { MatTableModule } from '@angular/material/table';
import {ReservationService} from '../../shared/services/reservation.service'
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  reservations: Reserved[] = []
  displayedColumns: string[] = ['datetime', 'name', 'price', 'delete'];
  isLoading = true;
  
  private subscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    console.log('RESERVATIONS:', this.reservations);

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.subscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.reservations = data.reservations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Hiba a felhasználói profil betöltésekor:', error);
        this.isLoading = false;
      }
    });
  }

  async delReservation(reservationId: string): Promise <void> {
    if(confirm("Biztosan lemonja a foglalást?")){
      try{
        await this.reservationService.deleteReservation(reservationId);
        this.reservations=this.reservations.filter(r => r.id !== reservationId);
        this.showNotification("Sikeres lemodás", "success")
      }
      catch (error){
        console.error("Hiba törléskor", error)
      }
      
    }
  }

  getUserInitials(): string {
    if (!this.user || !this.user.name) return '?';
    
    const firstInitial = this.user.name.firstname ? this.user.name.firstname.charAt(0).toUpperCase() : '';
    const lastInitial = this.user.name.lastname ? this.user.name.lastname.charAt(0).toUpperCase() : '';
    
    return firstInitial + (lastInitial ? lastInitial : '');
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
