import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../../core/models/user';
import { Address } from '../../../../core/models/address';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  user: User | null = null;
  userForm: FormGroup;
  addressForm: FormGroup;
  isEditingUser = false;
  isEditingAddress = false;
  isAddingAddress = false;
  selectedAddress: Address | null = null;
  loading = false;
  
  // Countries list for address form
  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'IN', name: 'India' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.userForm = this.createUserForm();
    this.addressForm = this.createAddressForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createUserForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      avatarUrl: ['']
    });
  }

  private createAddressForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: [''],
      postalCode: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required]],
      isDefault: [false]
    });
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: any) => {
        this.user = user;
        if (user) {
          this.populateUserForm(user);
        }
        this.loading = false;
      });
  }

  private populateUserForm(user: User): void {
    this.userForm.patchValue({
      name: user.name,
      phone: user.phone || '',
      avatarUrl: user.avatarUrl || ''
    });
  }

  private populateAddressForm(address: Address): void {
    this.addressForm.patchValue({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state || '',
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault || false
    });
  }

  toggleUserEdit(): void {
    this.isEditingUser = !this.isEditingUser;
    if (this.isEditingUser && this.user) {
      this.populateUserForm(this.user);
    }
  }

  toggleAddressEdit(address?: Address): void {
    this.isEditingAddress = !this.isEditingAddress;
    this.isAddingAddress = false;
    
    if (this.isEditingAddress && address) {
      this.selectedAddress = address;
      this.populateAddressForm(address);
    } else {
      this.selectedAddress = null;
      this.addressForm.reset();
    }
  }

  toggleAddAddress(): void {
    this.isAddingAddress = !this.isAddingAddress;
    this.isEditingAddress = false;
    this.selectedAddress = null;
    this.addressForm.reset();
  }

  saveUserInfo(): void {
    if (this.userForm.valid && this.user) {
      this.loading = true;
      const formData = this.userForm.value;
      
      // Update user service call would go here
      // For now, we'll simulate the update
      setTimeout(() => {
        this.user = {
          ...this.user!,
          name: formData.name,
          phone: formData.phone,
          avatarUrl: formData.avatarUrl
        };
        
        this.notificationService.showSuccess('Profile updated successfully!');
        this.isEditingUser = false;
        this.loading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched(this.userForm);
      this.notificationService.showError('Please fill in all required fields correctly.');
    }
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      this.loading = true;
      const formData = this.addressForm.value;
      
      if (this.isAddingAddress) {
        // Add new address
        const newAddress: Address = {
          id: Date.now().toString(), // Temporary ID
          ...formData
        };
        
        setTimeout(() => {
          if (this.user) {
            this.user.addresses = [...(this.user.addresses || []), newAddress];
            if (formData.isDefault) {
              this.user.defaultAddressId = newAddress.id;
            }
          }
          this.notificationService.showSuccess('Address added successfully!');
          this.resetAddressForm();
          this.loading = false;
        }, 1000);
      } else if (this.selectedAddress) {
        // Update existing address
        setTimeout(() => {
          if (this.user && this.user.addresses) {
            const index = this.user.addresses.findIndex((addr: Address) => addr.id === this.selectedAddress!.id);
            if (index !== -1) {
              this.user.addresses[index] = { ...this.selectedAddress, ...formData };
              if (formData.isDefault && this.selectedAddress) {
                this.user.defaultAddressId = this.selectedAddress!.id;
              }
            }
          }
          this.notificationService.showSuccess('Address updated successfully!');
          this.resetAddressForm();
          this.loading = false;
        }, 1000);
      }
    } else {
      this.markFormGroupTouched(this.addressForm);
      this.notificationService.showError('Please fill in all required fields correctly.');
    }
  }

  deleteAddress(address: Address): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.loading = true;
      
      setTimeout(() => {
        if (this.user && this.user.addresses) {
          this.user.addresses = this.user.addresses.filter((addr: Address) => addr.id !== address.id);
          if (this.user.defaultAddressId === address.id) {
            this.user.defaultAddressId = this.user.addresses.length > 0 ? this.user.addresses[0].id : undefined;
          }
        }
        this.notificationService.showSuccess('Address deleted successfully!');
        this.loading = false;
      }, 1000);
    }
  }

  setDefaultAddress(address: Address): void {
    if (this.user) {
      this.user.defaultAddressId = address.id;
      if (this.user.addresses) {
        this.user.addresses.forEach((addr: Address) => {
          addr.isDefault = addr.id === address.id;
        });
      }
      this.notificationService.showSuccess('Default address updated!');
    }
  }

  private resetAddressForm(): void {
    this.isEditingAddress = false;
    this.isAddingAddress = false;
    this.selectedAddress = null;
    this.addressForm.reset();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getAddressDisplayText(address: Address): string {
    return `${address.fullName}, ${address.street}, ${address.city}, ${address.state || ''} ${address.postalCode}, ${address.country}`;
  }

  getDefaultAddress(): Address | undefined {
    if (!this.user?.addresses) return undefined;
    return this.user.addresses.find((addr: Address) => addr.isDefault) || this.user.addresses[0];
  }
}
