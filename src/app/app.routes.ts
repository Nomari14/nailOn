import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './shared/guards/auth.guard';
// import { HomeComponent } from './pages/home/home.component';
// import { ReservationComponent } from './pages/reservation/reservation.component';
// import { ProfileComponent } from './pages/profile/profile.component';
// import { LoginComponent } from './pages/login/login.component';
// import { SignupComponent } from './pages/signup/signup.component';

// export const routes: Routes = [

//     {path: 'home', component: HomeComponent},

//     {path: 'reservation', component: ReservationComponent},

//     {path: 'profile', component: ProfileComponent},

//     {path: 'login', component: LoginComponent},

//     {path: 'signup', component: SignupComponent},

//     {path:'', redirectTo:'home', pathMatch:'full'},

// ];

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'reservation',
        loadComponent: () => import('./pages/reservation/reservation.component').then(m => m.ReservationComponent),
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
        canActivate: [publicGuard]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    
];