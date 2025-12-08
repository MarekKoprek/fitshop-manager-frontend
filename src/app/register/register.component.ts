import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  rePassword = '';

  constructor(private router: Router, private apiService: ApiService) {}

  register() {
    console.log("Rejestracja:", this.firstName, this.lastName, this.email);
    this.apiService.postWithoutHeaders('register', {
        login: this.email,
        email: this.email, 
        password: this.password, 
        name: this.firstName + " " + this.lastName
      }).subscribe({
      next: (res) => {
        console.log('Zarejestrowano!', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Błąd rejestracji', err);
      }
    });
  }
}
