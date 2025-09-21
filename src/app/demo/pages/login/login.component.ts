// angular import
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '@app/core/services/notification.service';
import { LoginRequest } from '@app/features/auth/models/auth-response.interface';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, NgbAlertModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  fb = inject(FormBuilder);

  authService = inject(AuthService);

  notificationService = inject(NotificationService);

  login = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    this.authService.login(this.login.value as LoginRequest).subscribe();
  }
}
