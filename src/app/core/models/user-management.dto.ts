export interface UserManagerDto {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  isBlocked: boolean;
  lockoutEnd?: Date;
  createdAt: Date;
  lastLoginAt?: Date;
  accessFailedCount: number;
  twoFactorEnabled: boolean;
}

export interface BlockUserDto {
  userId: string;
  blockUntil?: Date;
  reason: string;
}

export interface UnblockUserDto {
  userId: string;
}

export interface ChangeUserPasswordDto {
  userId: string;
  newPassword: string;
}

export interface ChangeUserEmailDto {
  userId: string;
  newEmail: string;
}

export interface SendEmailConfirmationDto {
  userId: string;
}

export interface UserSearchDto {
  searchTerm?: string;
  isBlocked?: boolean;
  emailConfirmed?: boolean;
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}