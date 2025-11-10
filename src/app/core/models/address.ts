export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  appUserId?: string;
}

export type CountryCode = string;





