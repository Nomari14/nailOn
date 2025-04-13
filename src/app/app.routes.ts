import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [

    {path: 'home', component: HomeComponent},

    {path: 'reservation', component: ReservationComponent},

    {path: 'profile', component: ProfileComponent},

    {path: 'login', component: LoginComponent},

    {path: 'signup', component: SignupComponent},

    {path:'', redirectTo:'home', pathMatch:'full'},


];
