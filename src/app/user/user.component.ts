import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  memberships: any[] = [];

  currentUser: any = null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.get<any>('get/auth/user').subscribe({
      next: (res) => {
        this.currentUser = res;
        console.log('Zalogowany użytkownik:', res);
      },
      error: (err) => {
        console.error('Błąd pobierania użytkownika', err);
        this.router.navigate(['/login']);
      }
    });

    this.apiService.get<any>('get/subscriptions').subscribe({
      next: (res) => {
        console.log('Dostępne karnety:', res);
        this.memberships = res;
      },
      error: (err) => {
        console.error('Błąd pobierania karnetów', err);
      }
    });
  }

  translateRole(role: string): string {
    switch (role) {
      case 'USER':
        return 'Klient';
      case 'TRAINER':
        return 'Trener';
      case 'ADMINISTAROR':
        return 'Admin';
      default:
        return role;
    }
  }
}
