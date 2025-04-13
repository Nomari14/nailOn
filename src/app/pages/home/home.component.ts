import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  isLoggedIn = false;
  constructor(private router: Router){

  }
  imagePath: string= "C:/Users/maria/project/public/korom.jpg"

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  changePage(){
    this.router.navigateByUrl("/reservation");
  }

}
