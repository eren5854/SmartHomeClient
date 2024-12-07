import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LayoutComponent } from './components/layout/layout.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "signup",
        component: SignupComponent
    },
    {
        path: "",
        component: LayoutComponent,
        canActivateChild:[() => inject(AuthService).isAuthenticated()],
        children:[
            {
                path: "",
                component: HomeComponent
            }
        ]
    }
];
