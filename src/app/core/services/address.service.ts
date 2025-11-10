import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
import { environment } from '../../../environments/environment.prod';

export interface ShippingAddressDto {
  id: number;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  appUserId?: string;
}

export interface ShippingAddressCreateDto {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface ShippingAddressUpdateDto {
  id: number;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = environment.apiUrl + '/Auth'; // Adjust based on your API base URL

  constructor(private http: HttpClient) { }

  // Get all addresses for the current user
  getMyAddresses(): Observable<ShippingAddressDto[]> {
    return this.http.get<ShippingAddressDto[]>(`${this.apiUrl}/my-addresses`);
  }

  // Get a specific address by ID
  getMyAddress(addressId: number): Observable<ShippingAddressDto> {
    return this.http.get<ShippingAddressDto>(`${this.apiUrl}/my-addresses/${addressId}`);
  }

  // Create a new address
  createMyAddress(addressDto: ShippingAddressCreateDto): Observable<ShippingAddressDto> {
    return this.http.post<ShippingAddressDto>(`${this.apiUrl}/my-addresses`, addressDto);
  }

  // Update an existing address
  updateMyAddress(addressId: number, addressDto: ShippingAddressUpdateDto): Observable<ShippingAddressDto> {
    return this.http.put<ShippingAddressDto>(`${this.apiUrl}/my-addresses/${addressId}`, addressDto);
  }

  // Delete an address
  deleteMyAddress(addressId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/my-addresses/${addressId}`);
  }

  // Convert ShippingAddressDto to Address
  convertToAddress(dto: ShippingAddressDto): Address {
    return {
      id: dto.id.toString(),
      fullName: dto.fullName,
      phone: dto.phone,
      street: dto.street,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
      isDefault: false // You might want to add this to your DTO
    };
  }

  // Convert Address to ShippingAddressCreateDto
  convertToCreateDto(address: Address): ShippingAddressCreateDto {
    return {
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country
    };
  }

  // Convert Address to ShippingAddressUpdateDto
  convertToUpdateDto(address: Address): ShippingAddressUpdateDto {
    return {
      id: parseInt(address.id!),
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country
    };
  }
}
