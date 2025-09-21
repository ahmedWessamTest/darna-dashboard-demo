import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  canActivate(): boolean | UrlTree {
    return this.checkAuth();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkAuth();
  }

  private checkAuth(): boolean | UrlTree {
    // Check if user is authenticated using signals
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Show notification for unauthorized access
    this.notificationService.warning('Please log in to access this page', 'Authentication Required');

    // Redirect to login page
    return this.router.createUrlTree(['/login']);
  }
}
