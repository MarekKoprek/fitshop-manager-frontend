import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.api.put('login', { login: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          console.log('Zalogowano!', res);
          this.router.navigate(['/user']);
          localStorage.setItem('token', (res as any).token);
          localStorage.setItem('user', JSON.stringify(res));
          // np. zapis tokenu i redirect
        },
        error: (err) => {
          console.error('Błąd logowania', err);
        }
      });
  }
}
