import { Injectable } from '@angular/core';

export type UserRole = 'UER' | 'TRAINER' | 'ADMIN';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private role: UserRole | null = null;

  setRole(role: UserRole) {
    this.role = role;
  }

  getRole(): UserRole | null {
    return this.role;
  }

  isLoggedIn(): boolean {
    return this.role !== null;
  }
}