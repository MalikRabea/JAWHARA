import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

export interface ToastConfig {
  text: string;
  duration?: number;
  close?: boolean;
  gravity?: 'top' | 'bottom';
  position?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  className?: string;
  onClick?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  /**
   * Show a success toast notification
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.showToast({
      text: this.createToastHTML(message, 'success'),
      duration,
      close: true,
      gravity: 'top',
      position: 'right',
      className: 'toast-success',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: '0',
        border: 'none',
      },
    });
  }

  /**
   * Show an error toast notification
   */
  showError(message: string, duration: number = 4000): void {
    this.showToast({
      text: this.createToastHTML(message, 'error'),
      duration,

      close: true,
      gravity: 'top',
      position: 'right',
      className: 'toast-error',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: '0',
        border: 'none',
      },
    });
  }

  /**
   * Show a warning toast notification
   */
  showWarning(message: string, duration: number = 3000): void {
    this.showToast({
      text: this.createToastHTML(message, 'warning'),
      duration,
      close: true,
      gravity: 'top',
      position: 'right',
      className: 'toast-warning',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: '0',
        border: 'none',
      },
    });
  }

  /**
   * Show an info toast notification
   */
  showInfo(message: string, duration: number = 3000): void {
    this.showToast({
      text: this.createToastHTML(message, 'info'),
      duration,
      close: true,
      gravity: 'top',
      position: 'right',
      className: 'toast-info',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: '0',
        border: 'none',
      },
    });
  }

  /**
   * Show a custom toast notification
   */
  showCustom(config: ToastConfig): void {
    this.showToast({
      ...config,
      className: config.className || 'toast-custom',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: '0',
        border: 'none',
      },
    });
  }

  /**
   * Show a toast with custom HTML content
   */
  private showToast(config: any): void {
    Toastify({
      ...config,
      escapeMarkup: false,
      offset: {
        x: 20,
        y: 20,
      },
    }).showToast();
  }

  /**
   * Create HTML markup for toast based on type
   */
  private createToastHTML(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ): string {
    const icons = {
      success: `<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>`,
      error: `<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m15 9-6 6"></path>
        <path d="m9 9 6 6"></path>
      </svg>`,
      warning: `<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <path d="M12 9v4"></path>
        <path d="m12 17 .01 0"></path>
      </svg>`,
      info: `<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="m12 8 .01 0"></path>
      </svg>`,
    };

    const colors = {
      success: {
        bg: 'bg-white border-green-300 shadow-lg border-l-4 border-l-green-500',
        icon: 'text-green-600',
        text: 'text-gray-800',
      },
      error: {
        bg: 'bg-white border-red-300 shadow-lg border-l-4 border-l-red-500',
        icon: 'text-red-600',
        text: 'text-gray-800',
      },
      warning: {
        bg: 'bg-white border-amber-300 shadow-lg border-l-4 border-l-amber-500',
        icon: 'text-amber-600',
        text: 'text-gray-800',
      },
      info: {
        bg: 'bg-white border-blue-300 shadow-lg border-l-4 border-l-blue-500',
        icon: 'text-blue-600',
        text: 'text-gray-800',
      },
    };
    return `
    <div class="max-w-sm w-full ${colors[type].bg} border rounded-xl transform transition-all duration-300 hover:scale-105" role="alert" tabindex="-1">
      <div class="flex p-4 items-start">
      <div class="ms-auto">
          <button type="button" onclick="this.closest('.toastify').remove()" 
            class="inline-flex shrink-0 justify-center items-center size-5 rounded-lg ${colors[type].text} opacity-50 hover:opacity-100 transition-opacity duration-200" 
            aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div> 
      <div class="shrink-0">
          <div class="${colors[type].icon}">
            ${icons[type]}
          </div>
        </div>
        <div class="ms-3 me-8 flex-1">
          <p class="${colors[type].text} text-sm font-medium leading-relaxed">
            ${message}
          </p>
        </div>
        
      </div>
    </div>
  `;
  }
}
