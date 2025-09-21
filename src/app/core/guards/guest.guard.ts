import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  canActivate(): boolean | UrlTree {
    // If user is NOT authenticated, allow access (guest pages like login/register)
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    // User is already authenticated, redirect to dashboard
    this.notificationService.info('You are already logged in', 'Already Authenticated');

    return this.router.createUrlTree(['/dashboard']);
  }
}
