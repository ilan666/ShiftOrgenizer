import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../appConfig';
import { Observable } from 'rxjs';
import { User } from '../entities/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${AppConfig.apiUrl}/users`; // Use the API URL from AppConfig

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUserEdit(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${username}`);
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the JWT in the authorization header
    });

    return this.http.get<any>(`${this.apiUrl}/me`, { headers }); // Modify URL according to your API endpoint
  }

  changeUserAdminState(user: User | null): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/adminstate', user);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  removeUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/remove', user);
  }

  updateUserShifts(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/update-shifts', user);
  }
}
