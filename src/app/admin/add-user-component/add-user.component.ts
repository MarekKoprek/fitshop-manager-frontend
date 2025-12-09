import { Component, Inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  form: FormGroup;

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: [data != null ? data.name : '', Validators.required],
      email: [data != null ? data.email : '', Validators.required],
      role: [data != null ? data.role : 0, Validators.required],
    });
    console.log('Inicjalizacja formularza z danymi:', data);
  }

  ngOnInit() {
    
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    console.log('Zapisz formularz:', this.form.value);
    if (this.form.valid) {
      this.apiService.post<any>('create/user', {
        id: this.data != null ? this.data.id : null,
        name: this.form.value.name,
        email: this.form.value.email,
        role: this.form.value.role,
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
