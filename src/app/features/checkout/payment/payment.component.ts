import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutSummary } from '../../../core/models/checkout-summary';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  @Input() checkoutSummary!: CheckoutSummary;
  @Output() paymentComplete = new EventEmitter<void>();
  
  paymentForm: FormGroup;
  selectedPaymentMethod = 'card';
  isSubmitting = false;

  paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'hs-icon hs-icon-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'hs-icon hs-icon-paypal' },
    { id: 'cod', name: 'Cash on Delivery', icon: 'hs-icon hs-icon-money' },
    { id: 'bank', name: 'Bank Transfer', icon: 'hs-icon hs-icon-bank' }
  ];

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardholderName: ['', [Validators.required, Validators.minLength(2)]],
      billingAddress: ['', [Validators.required]]
    });
  }

  onPaymentMethodChange(method: string): void {
    this.selectedPaymentMethod = method;
    
    // Clear form when switching payment methods
    this.paymentForm.reset();
    
    // Update validators based on payment method
    if (method === 'card') {
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]);
      this.paymentForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
      this.paymentForm.get('cardholderName')?.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      // Remove validators for non-card payments
      this.paymentForm.get('cardNumber')?.clearValidators();
      this.paymentForm.get('expiryDate')?.clearValidators();
      this.paymentForm.get('cvv')?.clearValidators();
      this.paymentForm.get('cardholderName')?.clearValidators();
    }
    
    this.paymentForm.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.selectedPaymentMethod === 'card' && this.paymentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Simulate payment processing
      setTimeout(() => {
        this.paymentComplete.emit();
        this.isSubmitting = false;
      }, 2000);
    } else if (this.selectedPaymentMethod !== 'card' && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Simulate payment processing for non-card methods
      setTimeout(() => {
        this.paymentComplete.emit();
        this.isSubmitting = false;
      }, 1500);
    } else if (this.selectedPaymentMethod === 'card') {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.paymentForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['pattern']) {
        if (fieldName === 'cardNumber') return 'Please enter a valid card number';
        if (fieldName === 'expiryDate') return 'Please enter a valid expiry date (MM/YY)';
        if (fieldName === 'cvv') return 'Please enter a valid CVV';
      }
      if (control.errors['minlength']) {
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length <= 19) {
      this.paymentForm.get('cardNumber')?.setValue(formattedValue);
    }
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.get('expiryDate')?.setValue(value);
  }
}
