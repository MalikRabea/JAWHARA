import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isSubmitting = false;
  loadingStep = '';
  showSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
  }

  // Custom Validators
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(value)) {
      return { invalidEmailFormat: true };
    }
    return null;
  }

  // Utility methods
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;

    switch (fieldName) {
      case 'email':
        if (errors['required']) return 'Email is required';
        if (errors['email'] || errors['invalidEmailFormat']) return 'Please enter a valid email address';
        break;
      
      case 'password':
        if (errors['required']) return 'Password is required';
        if (errors['minlength']) return 'Password must be at least 6 characters';
        break;
    }
    
    return '';
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    this.clearError(); // Clear any previous errors
    
    if (this.loginForm.valid) {
      this.startLoginProcess();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  private startLoginProcess(): void {
    this.isSubmitting = true;
    this.showSuccess = false;
    this.errorMessage = '';

    // Step 1: Authenticating
    this.loadingStep = 'Authenticating your credentials...';
    
    const loginData: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        // Step 2: Verifying account
        this.loadingStep = 'Verifying your account...';
        
        setTimeout(() => {
          // Step 3: Setting up session
          this.loadingStep = 'Setting up your session...';
          
          setTimeout(() => {
            // Login complete
            this.isSubmitting = false;
            this.showSuccess = true;
            this.loadingStep = 'Login successful!';
            
            console.log('Login successful:', response);
            
            // Auto-redirect after success
            setTimeout(() => {
              // Navigation is handled by AuthService based on user role
              console.log('Redirecting based on user role...');
            }, 2000);
          }, 800);
        }, 1000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error;
        this.loadingStep = '';
        console.error('Login error:', error);
      }
    });
  }

  // Form progress calculation
  getFormProgress(): number {
    const totalFields = 2; // email and password
    let validFields = 0;
    
    ['email', 'password'].forEach(fieldName => {
      if (this.loginForm.get(fieldName)?.valid) {
        validFields++;
      }
    });
    
    return (validFields / totalFields) * 100;
  }
}
