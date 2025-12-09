import { Component, Inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.css']
})
export class AddSubscriptionComponent {
  form: FormGroup;

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSubscriptionComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: [data != null ? data.name : '', Validators.required],
      description: [data != null ? data.description : '', Validators.required],
      amount: [data != null ? data.amount : 0, [Validators.required, Validators.min(1)]],
      features: this.fb.array(data != null ? data.details.map((feature: any) => this.fb.group({
        description: [feature.description]
      })) : [])
    });
    console.log('Inicjalizacja formularza z danymi:', data);
  }

  ngOnInit() {
    
  }

  get features(): FormArray {
    return this.form.get('features') as FormArray;
  }

  addFeature() {
    this.features.push(
      this.fb.group({
        description: ['']
      })
    );
  }

  removeFeature(index: number) {
    this.features.removeAt(index);
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    console.log('Zapisz formularz:', this.form.value);
    if (this.form.valid) {
      this.apiService.post<any>('create/subscription', {
        id: this.data != null ? this.data.id : null,
        name: this.form.value.name,
        description: this.form.value.description,
        amount: this.form.value.amount,
        details: this.form.value.features
      }).subscribe({
        next: (res) => {
          console.log('Karnet zapisany:', res);
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.error('Błąd zapisywania karnetu', err);
        }
      });
    }
  }
}
