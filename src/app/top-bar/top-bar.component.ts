import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  @Input() user: any = null;

  constructor (private router: Router) { }

  logout() {
    console.log("Wylogowano");
    this.router.navigate(['/login']);
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
