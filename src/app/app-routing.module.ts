import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guard/role.guard';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'user',
    component: UserComponent,
    // canActivate: [RoleGuard],
    // data: { roles: ['User', 'Admin'] }
  },
  {
    path: 'trainer',
    component: LoginComponent ,
    // canActivate: [RoleGuard],
    // data: { roles: ['Trainer', 'Admin'] }
  },
  {
    path: 'admin',
    component: LoginComponent ,
    // canActivate: [RoleGuard],
    // data: { roles: ['Admin'] }
  },
  {
    path: 'unauthorized',
    component: LoginComponent 
  },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'user'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
