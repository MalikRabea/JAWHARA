import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  UserManagerDto, 
  BlockUserDto, 
  UnblockUserDto, 
  ChangeUserPasswordDto, 
  ChangeUserEmailDto, 
  SendEmailConfirmationDto, 
  UserSearchDto, 
  PagedResult 
} from '../models/user-management.dto';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly apiUrl = `${environment.apiUrl}/admin/user-manager`;

  constructor(private http: HttpClient) { }

  getUsers(searchDto: UserSearchDto): Observable<PagedResult<UserManagerDto>> {
    let params = new HttpParams()
      .set('page', searchDto.page.toString())
      .set('pageSize', searchDto.pageSize.toString());

    if (searchDto.searchTerm) {
      params = params.set('searchTerm', searchDto.searchTerm);
    }
    if (searchDto.isBlocked !== undefined) {
      params = params.set('isBlocked', searchDto.isBlocked.toString());
    }
    if (searchDto.emailConfirmed !== undefined) {
      params = params.set('emailConfirmed', searchDto.emailConfirmed.toString());
    }

    return this.http.get<PagedResult<UserManagerDto>>(`${this.apiUrl}/users`, { params });
  }

  getUserById(userId: string): Observable<UserManagerDto> {
    return this.http.get<UserManagerDto>(`${this.apiUrl}/users/${userId}`);
  }

  blockUser(blockUserDto: BlockUserDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/block`, blockUserDto);
  }

  unblockUser(unblockUserDto: UnblockUserDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/unblock`, unblockUserDto);
  }

  changeUserPassword(changePasswordDto: ChangeUserPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-password`, changePasswordDto);
  }

  changeUserEmail(changeEmailDto: ChangeUserEmailDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-email`, changeEmailDto);
  }

  sendEmailConfirmation(sendEmailDto: SendEmailConfirmationDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/send-email-confirmation`, sendEmailDto);
  }

  confirmUserEmail(userId: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/confirm-email?token=${token}`, {});
  }

  resetUserPassword(userId: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/reset-password`, newPassword);
  }
}
