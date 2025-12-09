import { Component, Inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.css']
})
export class AddTrainingComponent {
  form: FormGroup;
  currentUser: any = null;
  trainers: any[] = [];

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddTrainingComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    let startDate;
    let startTime; 
    let endDate;
    let endTime; 

    if (data != null) {
      let [datePart, timePart] = data.startDate.split("T");
      startDate = datePart;
      startTime = timePart.substring(0, 5); 

      [datePart, timePart] = data.endDate.split("T");
      endDate = datePart;
      endTime = timePart.substring(0, 5); 
    }

    this.form = this.fb.group({
      title: [data != null ? data.title : '', Validators.required],
      description: [data != null ? data.description : '', Validators.required],
      startDate: [data != null ? startDate : '', Validators.required],
      startTime: [data != null ? startTime : '', Validators.required],
      endDate: [data != null ? endDate : '', Validators.required],
      endTime: [data != null ? endTime : '', Validators.required],
      limit: [data != null ? data.limit : '', [Validators.required, Validators.min(1)]],
    });
    if (this.currentUser.role === 'ROLE_ADMIN') {
      this.form.addControl('newTrainerEmail', this.fb.control(data != null ? data.trainer.email : '', Validators.required));
    }
    console.log('Inicjalizacja formularza z danymi:', data);
  }

  ngOnInit() {
    if (this.currentUser.role === 'ROLE_ADMIN') {
      this.apiService.get<any[]>('get/trainers').subscribe({
        next: (res) => {
          this.trainers = res;
        },
        error: (err) => {
          console.error('Błąd pobierania trenerów', err);
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    console.log('Zapisz formularz:', this.form.value);

    const startDate = new Date(this.form.value.startDate);
    const [startHours, startMinutes] = this.form.value.startTime.split(':');
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);

    const endDate = new Date(this.form.value.endDate);
    const [endHours, endMinutes] = this.form.value.endTime.split(':');
    endDate.setHours(endHours);
    endDate.setMinutes(endMinutes);

    if (this.form.valid) {
      this.apiService.post<any>('create/training', {
        id: this.data != null ? this.data.id : null,
        title: this.form.value.title,
        description: this.form.value.description,
        role: this.form.value.role,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: this.form.value.limit,
        newTrainerEmail: this.currentUser.role === 'ROLE_ADMIN' ? this.form.value.newTrainerEmail : ''
      }).subscribe({
        next: (res) => {
          console.log('Użytkownik zapisany:', res);
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.error('Błąd zapisywania użytkownika', err);
        }
      });
    }
  }
}
