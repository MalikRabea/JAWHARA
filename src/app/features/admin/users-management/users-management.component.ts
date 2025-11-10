import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../../core/services/user-management.service';
import { UserManagerDto, UserSearchDto, PagedResult } from '../../../core/models/user-management.dto';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-users-management',
  standalone: false,
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css'
})
export class UsersManagementComponent implements OnInit {
  users: UserManagerDto[] = [];
  pagedResult: PagedResult<UserManagerDto> | null = null;
  searchDto: UserSearchDto = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    isBlocked: undefined,
    emailConfirmed: undefined
  };
  
  loading = false;
  selectedUser: UserManagerDto | null = null;
  
  // Make Math available in template
  Math = Math;

  // Helper methods for template
  get activeUsersCount(): number {
    return this.users.filter(u => !u.isBlocked).length;
  }

  get blockedUsersCount(): number {
    return this.users.filter(u => u.isBlocked).length;
  }
  
  // Action form states
  showActionForm = false;
  currentAction: 'block' | 'unblock' | 'changePassword' | 'changeEmail' | null = null;
  
  // Form data
  blockReason = '';
  blockUntil: string = '';
  newPassword = '';
  confirmPassword = '';
  newEmail = '';

  constructor(
    private userManagementService: UserManagementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userManagementService.getUsers(this.searchDto).subscribe({
      next: (result) => {
        this.pagedResult = result;
        this.users = result.items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.notificationService.showError('Failed to load users');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.searchDto.page = 1;
    this.loadUsers();
  }

  onFilterChange(): void {
    this.searchDto.page = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.searchDto.page = page;
    this.loadUsers();
  }

  onPageSizeChange(pageSize: number): void {
    this.searchDto.pageSize = pageSize;
    this.searchDto.page = 1;
    this.loadUsers();
  }

  selectUser(user: UserManagerDto): void {
    this.selectedUser = user;
  }

  // Action Form Methods
  openActionForm(user: UserManagerDto, action: 'block' | 'unblock' | 'changePassword' | 'changeEmail'): void {
    this.selectedUser = user;
    this.currentAction = action;
    this.showActionForm = true;
    
    // Reset form data
    this.blockReason = '';
    this.blockUntil = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.newEmail = '';
  }

  closeActionForm(): void {
    this.showActionForm = false;
    this.currentAction = null;
    this.selectedUser = null;
    this.resetFormData();
  }

  resetFormData(): void {
    this.blockReason = '';
    this.blockUntil = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.newEmail = '';
  }

  // Block User
  blockUser(): void {
    if (!this.selectedUser) return;

    const blockUserDto = {
      userId: this.selectedUser.id,
      reason: this.blockReason,
      blockUntil: this.blockUntil ? new Date(this.blockUntil) : undefined
    };

    this.userManagementService.blockUser(blockUserDto).subscribe({
      next: () => {
        this.notificationService.showSuccess('User blocked successfully');
        this.closeActionForm();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error blocking user:', error);
        this.notificationService.showError('Failed to block user');
      }
    });
  }

  // Unblock User
  unblockUser(): void {
    if (!this.selectedUser) return;

    const unblockUserDto = {
      userId: this.selectedUser.id
    };

    this.userManagementService.unblockUser(unblockUserDto).subscribe({
      next: () => {
        this.notificationService.showSuccess('User unblocked successfully');
        this.closeActionForm();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error unblocking user:', error);
        this.notificationService.showError('Failed to unblock user');
      }
    });
  }

  // Change Password
  changePassword(): void {
    if (!this.selectedUser || !this.newPassword) return;

    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.showError('Passwords do not match');
      return;
    }

    const changePasswordDto = {
      userId: this.selectedUser.id,
      newPassword: this.newPassword
    };

    this.userManagementService.changeUserPassword(changePasswordDto).subscribe({
      next: () => {
        this.notificationService.showSuccess('Password changed successfully');
        this.closeActionForm();
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.notificationService.showError('Failed to change password');
      }
    });
  }

  // Change Email
  changeEmail(): void {
    if (!this.selectedUser || !this.newEmail) return;

    const changeEmailDto = {
      userId: this.selectedUser.id,
      newEmail: this.newEmail
    };

    this.userManagementService.changeUserEmail(changeEmailDto).subscribe({
      next: () => {
        this.notificationService.showSuccess('Email change confirmation sent');
        this.closeActionForm();
      },
      error: (error) => {
        console.error('Error changing email:', error);
        this.notificationService.showError('Failed to change email');
      }
    });
  }

  // Send Email Confirmation
  sendEmailConfirmation(user: UserManagerDto): void {
    const sendEmailDto = {
      userId: user.id
    };

    this.userManagementService.sendEmailConfirmation(sendEmailDto).subscribe({
      next: () => {
        this.notificationService.showSuccess('Email confirmation sent');
      },
      error: (error) => {
        console.error('Error sending email confirmation:', error);
        this.notificationService.showError('Failed to send email confirmation');
      }
    });
  }

  // Reset Password
  resetPassword(user: UserManagerDto): void {
    const newPassword = prompt('Enter new password (minimum 6 characters):');
    if (!newPassword || newPassword.length < 6) {
      this.notificationService.showError('Password must be at least 6 characters long');
      return;
    }

    this.userManagementService.resetUserPassword(user.id, newPassword).subscribe({
      next: () => {
        this.notificationService.showSuccess('Password reset successfully');
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        this.notificationService.showError('Failed to reset password');
      }
    });
  }

  // Utility methods
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }

  getStatusBadgeClass(user: UserManagerDto): string {
    if (user.isBlocked) {
      return 'bg-red-100 text-red-800';
    }
    if (!user.emailConfirmed) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  }

  getStatusText(user: UserManagerDto): string {
    if (user.isBlocked) {
      return 'Blocked';
    }
    if (!user.emailConfirmed) {
      return 'Unconfirmed';
    }
    return 'Active';
  }

}
