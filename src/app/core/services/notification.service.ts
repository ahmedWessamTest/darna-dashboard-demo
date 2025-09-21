import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  autoClose?: boolean;
  duration?: number; // in milliseconds
  closable?: boolean;
  timestamp: Date;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Signal for reactive notifications
  private _notifications = signal<Notification[]>([]);
  public notifications = this._notifications.asReadonly();

  // Default configuration
  private defaultConfig = {
    autoClose: true,
    duration: 5000, // 5 seconds
    closable: true
  };

  /**
   * Show a success notification
   */
  success(message: string, title?: string, options?: Partial<Notification>): void {
    this.show('success', message, title, options);
  }

  /**
   * Show an error notification
   */
  error(message: string, title?: string, options?: Partial<Notification>): void {
    this.show('error', message, title, { ...options, autoClose: false });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, title?: string, options?: Partial<Notification>): void {
    this.show('warning', message, title, options);
  }

  /**
   * Show an info notification
   */
  info(message: string, title?: string, options?: Partial<Notification>): void {
    this.show('info', message, title, options);
  }

  /**
   * Show a notification with custom type
   */
  show(type: NotificationType, message: string, title?: string, options?: Partial<Notification>): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      ...this.defaultConfig,
      ...options
    };

    // Add to notifications array
    this._notifications.update((notifications) => [...notifications, notification]);

    // Auto-close if enabled
    if (notification.autoClose && notification.duration) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }
  }

  /**
   * Remove a notification by ID
   */
  remove(id: string): void {
    this._notifications.update((notifications) => notifications.filter((notification) => notification.id !== id));
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this._notifications.set([]);
  }

  /**
   * Get notification count
   */
  get count(): number {
    return this._notifications().length;
  }

  /**
   * Get notifications by type
   */
  getByType(type: NotificationType): Notification[] {
    return this._notifications().filter((notification) => notification.type === type);
  }

  /**
   * Quick notification methods for common scenarios
   */
  // API Success
  apiSuccess(message: string = 'Operation completed successfully'): void {
    this.success(message, 'Success');
  }

  // API Error
  apiError(message: string = 'Something went wrong'): void {
    this.error(message, 'Error');
  }

  // Login Success
  loginSuccess(username?: string): void {
    const message = username ? `Welcome back, ${username}!` : 'Welcome back!';
    this.success(message, 'Login Successful');
  }

  // Logout Success
  logoutSuccess(): void {
    this.info('You have been logged out successfully', 'Goodbye');
  }

  // Form Validation Error
  formError(message: string = 'Please check the form for errors'): void {
    this.warning(message, 'Form Validation');
  }

  // Network Error
  networkError(): void {
    this.error('Please check your internet connection', 'Connection Error');
  }

  // Unauthorized Access
  unauthorizedError(): void {
    this.error('You are not authorized to perform this action', 'Access Denied');
  }

  /**
   * Generate unique ID for notifications
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
