import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guard/role.guard';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';

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
    // data: { roles: ['USER', 'ADMIN'] }
  },
  {
    path: 'trainer',
    component: LoginComponent,
    // canActivate: [RoleGuard],
    // data: { roles: ['TRAINER', 'ADMIN'] }
  },
  {
    path: 'admin',
    component: AdminComponent,
    // canActivate: [RoleGuard],
    // data: { roles: ['ADMIN'] }
  },
  {
    path: 'unauthorized',
    component: LoginComponent 
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
