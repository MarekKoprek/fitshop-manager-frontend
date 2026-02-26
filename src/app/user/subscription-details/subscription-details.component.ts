import { Component, Inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.css']
})
export class SubscriptionDetailsComponent {
  form: FormGroup;
  paymentMethod: 'card' | 'blik' = 'card';

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SubscriptionDetailsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      blikCode: [''],
      cardNumber: [''],
      cardExpiryDate: [''],
      cardCvv: [''],
    });
    this.switchPaymentMethod('card');
    console.log('Inicjalizacja formularza z danymi:', data);
  }

  ngOnInit() {
    
  }

  close() {
    this.dialogRef.close();
  }

  switchPaymentMethod(method: 'card' | 'blik') {
    this.paymentMethod = method;
    const cardNumber = this.form.get('cardNumber');
    const cardExpiryDate = this.form.get('cardExpiryDate');
    const cardCvv = this.form.get('cardCvv');
    const blikCode = this.form.get('blikCode');

    if (method === 'card') {
      blikCode?.clearValidators();
      blikCode?.setErrors(null);
      blikCode?.updateValueAndValidity();

      cardNumber?.setValidators(Validators.required);
      cardExpiryDate?.setValidators(Validators.required);
      cardCvv?.setValidators(Validators.required);

      cardNumber?.updateValueAndValidity();
      cardExpiryDate?.updateValueAndValidity();
      cardCvv?.updateValueAndValidity();
    } else {
      cardNumber?.clearValidators();
      cardExpiryDate?.clearValidators();
      cardCvv?.clearValidators();

      cardNumber?.setErrors(null);
      cardExpiryDate?.setErrors(null);
      cardCvv?.setErrors(null);

      cardNumber?.updateValueAndValidity();
      cardExpiryDate?.updateValueAndValidity();
      cardCvv?.updateValueAndValidity();

      blikCode?.setValidators(Validators.required);
      blikCode?.updateValueAndValidity();
    }
  }

  buy() {
    console.log('Kupiono karnet:', this.data);
    console.log('Dane płatności:', this.form.value);
    this.apiService.post<any>('create/subscription/payment/' + this.data.id, this.form.value).subscribe({
      next: (response) => {
        console.log('Płatność utworzona:', response);
        this.dialogRef.close({ success: true, payment: response });
      },
      error: (error) => {
        console.error('Błąd podczas tworzenia płatności:', error);
        this.dialogRef.close({ error: 'Błąd podczas tworzenia płatności' });
      }
    });
  }
}
