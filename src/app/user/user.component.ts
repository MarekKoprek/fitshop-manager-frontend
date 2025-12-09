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
  availableTrainings: any[] = [];
  participatingTrainings: any[] = [];

  currentUser: any = null;
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;

  closestTrainingTitle: string = '';

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

    this.getOwnTrainings();
    this.getAvailableTrainings();
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

  translateMonth(month: number): string {
    const months = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    return months[month - 1] || '';
  }

  increaseMonth() {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.getAvailableTrainings();
  }

  decreaseMonth() {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.getAvailableTrainings();
  }

  getAvailableTrainings() {
    this.apiService.get<any>(`get/trainings/${this.currentYear}/${this.currentMonth}`).subscribe({
      next: (res) => {
        console.log(`Dostępne treningi ${this.currentMonth}-${this.currentYear}:`, res);
        this.availableTrainings = res;
      },
      error: (err) => {
        console.error('Błąd pobierania dostępnych treningów', err);
      }
    });
  }

  getOwnTrainings() {
    this.apiService.get<any>('get/own/trainings').subscribe({
      next: (res) => {
        console.log('Treningi klienta:', res);
        this.participatingTrainings = res;

        const now = new Date();
        const upcomingTrainings = res.filter((training: any) => new Date(training.startDate) > now);
        if (upcomingTrainings.length > 0) {
          upcomingTrainings.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          this.closestTrainingTitle = upcomingTrainings[0].title;
        } else {
          this.closestTrainingTitle = 'Brak nadchodzących treningów';
        }
      },
      error: (err) => {
        console.error('Błąd pobierania treningów klienta', err);
      } 
    });
  }

  onParticipate(trainingId: number) {
    this.apiService.put<any>(`participate/training/${trainingId}`, {}).subscribe({
      next: (res) => {
        console.log('Zapisano na trening:', res);
        this.getAvailableTrainings();
        this.getOwnTrainings();
      },
      error: (err) => {
        console.error('Błąd zapisywania na trening', err);
      }
    });
  }

  onParticipateRemove(trainingId: number) {
    this.apiService.put<any>(`participate/remove/training/${trainingId}`, {}).subscribe({
      next: (res) => {
        console.log('Wypisano z treningu:', res);
        this.getAvailableTrainings();
        this.getOwnTrainings();
      },
      error: (err) => {
        console.error('Błąd wypisywania z treningu', err);
      }
    });
  }

  translateDate(dateString: string): string {
    const date = new Date(dateString);
    return date.getDate() + " " + this.translateMonth(date.getMonth() + 1) + " " + date.getFullYear() + ", " +
           date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
  }

  onCurrentSubscriptionClick() {
    console.log('Kliknięto na bieżący karnet');
  }
}
