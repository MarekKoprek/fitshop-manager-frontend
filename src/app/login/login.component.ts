import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private api: ApiService, private router: Router, private authService: AuthService) {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.redirect(user.role.substring(5));
    }
  }

  login() {
    this.api.putWithoutHeaders('login', { login: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          console.log('Zalogowano!', res);
          this.authService.setRole((res as any).role.substring(5));
          localStorage.setItem('token', (res as any).token);
          localStorage.setItem('user', JSON.stringify(res));
          this.redirect((res as any).role.substring(5));
        },
        error: (err) => {
          console.error('Błąd logowania', err);
        }
      });
  }

  redirect(role: string) {
    switch (role) {
      case 'USER':
        this.router.navigate(['/user']);
        break;
      case 'TRAINER':
        this.router.navigate(['/trainer']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}
