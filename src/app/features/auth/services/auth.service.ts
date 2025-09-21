import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { baseUrl } from '@app/core/env';
import { NotificationService } from '@core/services/notification.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest } from '../models/auth-response.interface';

export interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  private readonly TOKEN_KEY = 'access_token';

  // Signals for reactive state
  public isAuthenticated = signal<boolean>(false);
  public token = signal<string | null>(null);

  constructor() {
    // Check if user is already logged in
    const savedToken = localStorage.getItem(this.TOKEN_KEY);
    if (savedToken) {
      this.setToken(savedToken);
    }
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    const loginFormData = new FormData();
    loginFormData.append('email', loginData.email);
    loginFormData.append('password', loginData.password);

    return this.http.post<AuthResponse>(`${baseUrl}api/login`, loginFormData).pipe(
      tap((response) => {
        if (response.access_token) {
          this.setToken(response.access_token);
          // Show success notification
          this.notificationService.loginSuccess(loginData.email);
          this.router.navigate(['/dashboard']);
        } else {
          this.notificationService.error('Invalid credentials. Please try again.', 'Login Failed');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.setToken(null);

    // Show logout notification
    this.notificationService.logoutSuccess();

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.token.set(token);
      this.isAuthenticated.set(true);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
      this.token.set(null);
      this.isAuthenticated.set(false);
    }
  }
}
