import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../../core/models/address';
import { AddressService, ShippingAddressDto } from '../../../core/services/address.service';

@Component({
  selector: 'app-shipping-address',
  standalone: false,
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {
  @Output() shippingComplete = new EventEmitter<Address>();
  
  shippingForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  userAddress: Address | null = null;
  showNewAddressForm = false;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService
  ) {
    this.shippingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: [''],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', [Validators.required]],
      isDefault: [false]
    });
  }

  ngOnInit(): void {
    this.loadUserAddress();
  }

  loadUserAddress(): void {
    this.isLoading = true;
    this.addressService.getMyAddresses().subscribe({
      next: (addresses: ShippingAddressDto[]) => {
        // Get the first (and only) address
        if (addresses.length > 0) {
          this.userAddress = this.addressService.convertToAddress(addresses[0]);
          this.showNewAddressForm = false;
        } else {
          this.userAddress = null;
          this.showNewAddressForm = true;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading address:', error);
        this.isLoading = false;
        this.userAddress = null;
        this.showNewAddressForm = true;
      }
    });
  }

  onUseExistingAddress(): void {
    if (this.userAddress) {
      this.shippingComplete.emit(this.userAddress);
    }
  }

  onEditAddress(): void {
    this.showNewAddressForm = true;
    if (this.userAddress) {
      this.populateForm(this.userAddress);
    }
  }

  onAddNewAddress(): void {
    this.showNewAddressForm = true;
    this.shippingForm.reset();
  }

  onSubmit(): void {
    if (this.shippingForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const addressData = this.shippingForm.value as Address;
      
      if (this.userAddress) {
        // Update existing address
        addressData.id = this.userAddress.id;
        this.updateAddress(addressData);
      } else {
        // Create new address
        this.createAddress(addressData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createAddress(address: Address): void {
    const createDto = this.addressService.convertToCreateDto(address);
    this.addressService.createMyAddress(createDto).subscribe({
      next: (createdAddress) => {
        this.userAddress = this.addressService.convertToAddress(createdAddress);
        this.shippingComplete.emit(this.userAddress);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creating address:', error);
        this.isSubmitting = false;
      }
    });
  }

  private updateAddress(address: Address): void {
    const updateDto = this.addressService.convertToUpdateDto(address);
    this.addressService.updateMyAddress(parseInt(address.id!), updateDto).subscribe({
      next: (updatedAddress) => {
        this.userAddress = this.addressService.convertToAddress(updatedAddress);
        this.shippingComplete.emit(this.userAddress);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating address:', error);
        this.isSubmitting = false;
      }
    });
  }

  private populateForm(address: Address): void {
    this.shippingForm.patchValue({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.shippingForm.controls).forEach(key => {
      const control = this.shippingForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.shippingForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['minlength']) {
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        if (fieldName === 'phone') return 'Please enter a valid phone number';
        if (fieldName === 'postalCode') return 'Please enter a valid postal code';
      }
    }
    return '';
  }
}
