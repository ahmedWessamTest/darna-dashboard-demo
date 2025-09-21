import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NgbAlertModule],
  template: `
    <div class="notification-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <ngb-alert
          [type]="getBootstrapType(notification.type)"
          [dismissible]="notification.closable"
          (closed)="onClose(notification.id)"
          class="notification-alert"
          [class]="'alert-' + notification.type"
        >
          <div class="notification-content">
            @if (notification.title) {
              <h6 class="notification-title mb-1">
                <i [class]="getIcon(notification.type)"></i>
                {{ notification.title }}
              </h6>
            }
            <div class="notification-message">
              {{ notification.message }}
            </div>
          </div>
        </ngb-alert>
      }
    </div>
  `,
  styles: [
    `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1050;
        max-width: 400px;
        width: 100%;
      }

      .notification-alert {
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: none;
        border-radius: 8px;
        animation: slideIn 0.3s ease-out;
      }

      .notification-content {
        display: flex;
        flex-direction: column;
      }

      .notification-title {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .notification-message {
        margin-bottom: 4px;
        line-height: 1.4;
      }

      .notification-time {
        font-size: 0.75rem;
        opacity: 0.8;
      }

      /* Animation */
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Custom alert colors */
      .alert-success {
        background-color: #d1f2eb;
        border-left: 4px solid #27ae60;
        color: #155724;
      }

      .alert-error {
        background-color: #fadbd8;
        border-left: 4px solid #e74c3c;
        color: #721c24;
      }

      .alert-warning {
        background-color: #fef9e7;
        border-left: 4px solid #f39c12;
        color: #856404;
      }

      .alert-info {
        background-color: #d6eaf8;
        border-left: 4px solid #3498db;
        color: #0c5460;
      }

      /* Mobile responsive */
      @media (max-width: 576px) {
        .notification-container {
          left: 10px;
          right: 10px;
          max-width: none;
        }
      }
    `
  ]
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);

  onClose(id: string): void {
    this.notificationService.remove(id);
  }

  getBootstrapType(type: string): string {
    // Map our types to Bootstrap alert types
    const typeMap: { [key: string]: string } = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'info'
    };
    return typeMap[type] || 'info';
  }

  getIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      success: 'ti ti-check-circle',
      error: 'ti ti-x-circle',
      warning: 'ti ti-alert-triangle',
      info: 'ti ti-info-circle'
    };
    return iconMap[type] || 'ti ti-info-circle';
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  }
}
