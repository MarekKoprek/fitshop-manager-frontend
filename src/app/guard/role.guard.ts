import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRoles = route.data['roles'] as Array<string>;
    const currentRole = this.auth.getRole();

    if (!currentRole || !expectedRoles.includes(currentRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}