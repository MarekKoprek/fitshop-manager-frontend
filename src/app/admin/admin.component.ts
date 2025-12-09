import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { AddSubscriptionComponent } from './add-subscription-component/add-subscription.component';
import { ConfirmComponent } from '../confirm-component/confirm.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { AddUserComponent } from './add-user-component/add-user.component';
import { AddTrainingComponent } from './add-training-component/add-training.component';

@Component({
  selector: 'app-user',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [DatePipe]
})
export class AdminComponent {
  memberships: any[] = [];
  availableTrainings: any[] = [];
  participatingTrainings: any[] = [];
  selectedTabLabel: string = 'Karnety';

  currentUser: any = null;

  userFilter = {
    email: '',
    name: '',
    role: ''
  };

  trainingFilter = {
    title: '',
    trainer: '',
    date: '',
    limit: '',
  };

  displayedUserColumns: string[] = ['email', 'name', 'role', 'actions'];
  displayedTrainingColumns: string[] = ['title', 'trainer', 'date', 'limit', 'actions'];

  users = new MatTableDataSource<any>([]);
  trainings = new MatTableDataSource<any>([]);

  totalUsers = 0;
  totalTrainings = 0;

  userPageSize = 10;
  trainingPageSize = 10;

  userCurrentPage = 0;
  trainingCurrentPage = 0;

  @ViewChild('userPaginator') paginator!: MatPaginator;
  @ViewChild('trainingPaginator') trainingPaginator!: MatPaginator;

  constructor(private apiService: ApiService, private router: Router, private dialog: MatDialog, private datePipe: DatePipe) { }

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

    this.getSubscriptions();
    this.getUsers();
    this.getTrainings();
  }

  getSubscriptions() {
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

  getUsers() {
    this.apiService.get<any>('get/users', {
      email: this.userFilter.email,
      name: this.userFilter.name,
      role: this.userFilter.role,
      page: this.userCurrentPage,
      size: this.userPageSize
    }).subscribe({
      next: (res) => {
        console.log('Pobrani użytkownicy:', res);
        this.users.data = res.content;
        this.totalUsers = res.totalElements;
      },
      error: (err) => {
        console.error('Błąd pobierania użytkowników', err);
      }
    });
  }

  getTrainings() {
    const params = {
      page: this.trainingCurrentPage,
      size: this.trainingPageSize,
      title: this.trainingFilter.title,
      trainer: this.trainingFilter.trainer,
      limit: this.trainingFilter.limit
    };
    const paramsWithDate = {
      page: this.trainingCurrentPage,
      size: this.trainingPageSize,
      title: this.trainingFilter.title,
      trainer: this.trainingFilter.trainer,
      date: this.trainingFilter.date && this.trainingFilter.date != '' ? this.trainingFilter.date : null,
      limit: this.trainingFilter.limit
    };
    this.apiService.get<any>(
      'administrator/get/trainings', 
      this.trainingFilter.date && this.trainingFilter.date != '' ? paramsWithDate : params
    ).subscribe({
      next: (res) => {
        console.log('Pobrane treningi:', res);
        this.trainings.data = res.content;
        this.totalTrainings = res.totalElements;
      },
      error: (err) => {
        console.error('Błąd pobierania treningów', err);
      }
    });
  }

  applyUserFilter() {
    this.userCurrentPage = 0;
    this.getUsers();
  }

  applyTrainingFilter() {
    if (this.trainingFilter.date) {
      this.trainingFilter.date = this.datePipe.transform(this.trainingFilter.date, 'yyyy-MM-dd') || '';
    }
    this.trainingCurrentPage = 0;
    this.getTrainings();
  }

  onUserPageChange(event: PageEvent) {
    this.userPageSize = event.pageSize;
    this.userCurrentPage = event.pageIndex;
    this.getUsers();
  }

  onTrainingPageChange(event: PageEvent) {
    this.trainingPageSize = event.pageSize;
    this.trainingCurrentPage = event.pageIndex;
    this.getTrainings();
  }

  translateRole(role: string): string {
    switch (role) {
      case 'USER':
        return 'Klient';
      case 'TRAINER':
        return 'Trener';
      case 'ADMIN':
        return 'Admin';
      default:
        return role;
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    console.log("Wybrany index:", event.index);
    console.log("Wybrany label:", event.tab.textLabel);

    this.selectedTabLabel = event.tab.textLabel;
  }

  onSubscriptionDialog(membership: any) {
    const dialogRef = this.dialog.open(AddSubscriptionComponent, {
      width: '40vw',
      maxHeight: '80vh',
      data: membership
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog zamknięty z wynikiem:', result);
        this.getSubscriptions();
      }
    });
  }

  onAddElement() {
    if (this.selectedTabLabel === 'Karnety') {
      this.onSubscriptionDialog(null);
    } else if (this.selectedTabLabel === 'Użytkownicy') {
      this.onUserDialog(null);
    } else if (this.selectedTabLabel === 'Treningi') {
      this.onTrainingDialog(null);
    }
  }

  onDeleteMembership(membershipId: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '35vw',
      data: { message: 'Czy na pewno chcesz usunąć ten element?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.post<any>(`delete/subscription/${membershipId}`, null).subscribe({
          next: (res) => {
            console.log('Karnet usunięty:', res);
            this.memberships = this.memberships.filter(m => m.id !== membershipId);
          },
          error: (err) => {
            console.error('Błąd usuwania karnetu', err);
          }
        });
      }
    });
  }

  onBlockUser(userId: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '35vw',
      data: { message: 'Czy na pewno chcesz zablokować tego użytkownika?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.put<any>(`block/user/${userId}`, null).subscribe({
          next: (res) => {
            console.log('Użytkownik zablokowany:', res);
            this.getUsers();
          },
          error: (err) => {
            console.error('Błąd blokowania użytkownika', err);
          }
        }); 
      }
    });
  }

  onUserDialog(user: any) {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '40vw',
      maxHeight: '80vh',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog zamknięty z wynikiem:', result);
        this.getUsers();
      }
    });
  }

  onTrainingDialog(training: any) {
    const dialogRef = this.dialog.open(AddTrainingComponent, {
      width: '40vw',
      maxHeight: '80vh',
      data: training
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog zamknięty z wynikiem:', result);
        this.getTrainings();
      }
    });
  }

  onDeleteTraining(trainingId: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '35vw',
      data: { message: 'Czy na pewno chcesz usunąć ten trening?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.post<any>(`delete/training/${trainingId}`, null).subscribe({
          next: (res) => {
            console.log('Trening usunięty:', res);
            this.getTrainings();
          },
          error: (err) => {
            console.error('Błąd usuwania treningu', err);
          }
        });
      }
    });
  }
}
