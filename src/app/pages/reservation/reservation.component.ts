import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { Router } from '@angular/router';



@Component({
  selector: 'app-reservation',
  providers: provideNativeDateAdapter(),
  imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, MatTimepickerModule], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {
  constructor(private router: Router){
  }


}

export class Datepicker {}

export class Timepicker {}

