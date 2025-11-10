import { Address } from './address';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  addresses?: Address[];
  defaultAddressId?: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}
