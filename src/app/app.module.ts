import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginComponent } from './login/login.component';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddSubscriptionComponent } from './admin/add-subscription-component/add-subscription.component';
import { ConfirmComponent } from './confirm-component/confirm.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { AddUserComponent } from './admin/add-user-component/add-user.component';
import { AddTrainingComponent } from './admin/add-training-component/add-training.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    TopBarComponent,
    RegisterComponent,
    AdminComponent,
    AddSubscriptionComponent,
    ConfirmComponent,
    AddUserComponent,
    AddTrainingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    MatDividerModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
