import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false; // Return false if there is no token
    }

    try {
      const decoded: any = jwtDecode(token); // Decode the token
      const isExpired = decoded.exp * 1000 < Date.now(); // Check expiration
      return !isExpired; // Return true if the token is valid (not expired)
    } catch (error) {
      console.error('Token decoding error:', error);
      return false; // Return false if there was an error decoding the token
    }
  }

  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public logOut(): void {
    localStorage.removeItem('authToken'); // Clear token on logout
  }
}
