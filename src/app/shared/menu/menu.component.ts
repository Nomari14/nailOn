import { Component, AfterViewInit, Input, OnInit, input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { SimpleChanges } from '@angular/core';



@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatListModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() sidenav!: MatSidenav;
  @Output() logoutEvent = new EventEmitter<void>();
  isLoggedIn = false;


  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {
    console.log("constructor called");
  }

  ngOnInit(): void {
    console.log("ngOnInit called");
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit called");
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  closeMenu(){
      if (this.sidenav) {
          this.sidenav.close();
      }
  }

  logout() {
    this.authService.signOut().then(() => {
      this.logoutEvent.emit();
      this.closeMenu();
    });
  }
}
