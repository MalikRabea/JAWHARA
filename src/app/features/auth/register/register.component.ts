import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  loadingProgress = 0;
  loadingStep = '';
  showSuccess = false;
  
  // Expose Math to template
  Math = Math;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        this.nameValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailValidator
      ]],
      phoneNumber: ['', [
        Validators.required,
        this.phoneValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom Validators
  nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const namePattern = /^[a-zA-Z\s\u0600-\u06FF]+$/;
    if (!namePattern.test(value)) {
      return { invalidName: true };
    }
    return null;
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(value)) {
      return { invalidEmailFormat: true };
    }
    return null;
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Support multiple phone formats (international, local, etc.)
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phonePattern.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return { invalidPhone: true };
    }
    return null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const errors: ValidationErrors = {};
    
    if (!/(?=.*[a-z])/.test(value)) {
      errors['noLowercase'] = true;
    }
    
    if (!/(?=.*[A-Z])/.test(value)) {
      errors['noUppercase'] = true;
    }
    
    if (!/(?=.*\d)/.test(value)) {
      errors['noNumber'] = true;
    }
    
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      errors['noSpecialChar'] = true;
    }
    
    return Object.keys(errors).length ? errors : null;
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.errors) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    
    return null;
  }

  // Utility methods
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;

    switch (fieldName) {
      case 'name':
        if (errors['required']) return 'Name is required';
        if (errors['minlength']) return 'Name must be at least 2 characters';
        if (errors['maxlength']) return 'Name must not exceed 50 characters';
        if (errors['invalidName']) return 'Name can only contain letters and spaces';
        break;
      
      case 'email':
        if (errors['required']) return 'Email is required';
        if (errors['email'] || errors['invalidEmailFormat']) return 'Please enter a valid email address';
        break;
      
      case 'phoneNumber':
        if (errors['required']) return 'Phone number is required';
        if (errors['invalidPhone']) return 'Please enter a valid phone number';
        break;
      
      case 'password':
        if (errors['required']) return 'Password is required';
        if (errors['minlength']) return 'Password must be at least 8 characters';
        if (errors['noLowercase']) return 'Password must contain at least one lowercase letter';
        if (errors['noUppercase']) return 'Password must contain at least one uppercase letter';
        if (errors['noNumber']) return 'Password must contain at least one number';
        if (errors['noSpecialChar']) return 'Password must contain at least one special character (@$!%*?&)';
        break;
      
      case 'confirmPassword':
        if (errors['required']) return 'Please confirm your password';
        if (errors['passwordMismatch']) return 'Passwords do not match';
        break;
    }
    
    return '';
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.startRegistrationProcess();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  private startRegistrationProcess(): void {
    this.isSubmitting = true;
    this.loadingProgress = 0;
    this.showSuccess = false;

    // Step 1: Validating information
    this.loadingStep = 'Validating your information...';
    this.animateProgress(20, 800);
    
    setTimeout(() => {
      // Step 2: Creating account
      this.loadingStep = 'Creating your account...';
      this.animateProgress(50, 1000);
      
      setTimeout(() => {
        // Step 3: Setting up security
        this.loadingStep = 'Setting up security features...';
        this.animateProgress(80, 800);
        
        setTimeout(() => {
          // Step 4: Finalizing
          this.loadingStep = 'Finalizing registration...';
          this.animateProgress(100, 600);
          
          setTimeout(() => {
            // Registration complete
            this.isSubmitting = false;
            this.showSuccess = true;
            this.loadingStep = 'Account created successfully!';
            
            console.log('Registration data:', this.registerForm.value);
            
            // Auto-redirect after success
            setTimeout(() => {
              // Handle successful registration here (e.g., navigate to login)
              console.log('Redirecting to login...');
            }, 2000);
          }, 600);
        }, 800);
      }, 1000);
    }, 800);
  }

  private animateProgress(targetProgress: number, duration: number): void {
    const startProgress = this.loadingProgress;
    const difference = targetProgress - startProgress;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      this.loadingProgress = startProgress + (difference * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.loadingProgress = targetProgress;
      }
    };

    requestAnimationFrame(animate);
  }

  // Form progress calculation
  getFormProgress(): number {
    const totalFields = 5;
    let validFields = 0;
    
    Object.keys(this.registerForm.controls).forEach(key => {
      if (this.registerForm.get(key)?.valid) {
        validFields++;
      }
    });
    
    return (validFields / totalFields) * 100;
  }

  // Password strength methods
  getPasswordStrength(): number {
    const password = this.registerForm.get('password');
    if (!password || !password.value) return 0;
    
    let strength = 0;
    const checks = [
      password.value.length >= 8,
      !password.hasError('noLowercase'),
      !password.hasError('noUppercase'),
      !password.hasError('noNumber'),
      !password.hasError('noSpecialChar')
    ];
    
    strength = (checks.filter(Boolean).length / checks.length) * 100;
    return Math.min(strength, 100);
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    
    if (strength === 0) return 'Enter Password';
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Good';
    if (strength < 100) return 'Strong';
    return 'Excellent';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    
    if (strength === 0) return 'bg-gray-100 text-gray-500';
    if (strength < 25) return 'bg-red-100 text-red-700';
    if (strength < 50) return 'bg-orange-100 text-orange-700';
    if (strength < 75) return 'bg-yellow-100 text-yellow-700';
    if (strength < 100) return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  }

  getPasswordStrengthBarClass(): string {
    const strength = this.getPasswordStrength();
    
    if (strength === 0) return 'from-gray-300 to-gray-400';
    if (strength < 25) return 'from-red-400 to-red-600';
    if (strength < 50) return 'from-orange-400 to-orange-600';
    if (strength < 75) return 'from-yellow-400 to-yellow-600';
    if (strength < 100) return 'from-blue-400 to-blue-600';
    return 'from-green-400 to-green-600';
  }
}
