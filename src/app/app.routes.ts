import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { guardGuard } from './guard/guard.guard';

export const routes: Routes = [
    {
        path: "login",
        loadChildren: () =>
            import('./login/login.module').then((m) => m.LoginModule)
    },
    {
        path: "signup",
        component: SignUpComponent
    },
    {
        path: "user",
        loadChildren: () =>
            import('./user/user.module').then((m) => m.UserModule),
        canActivate: [guardGuard]
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    { 
        
        path: '**', 
        component: PageNotFoundComponent 
    }
];
