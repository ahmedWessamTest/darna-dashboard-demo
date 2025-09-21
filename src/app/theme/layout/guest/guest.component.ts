// Angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '@app/demo/pages/login/login.component';

@Component({
  selector: 'app-guest',
  imports: [RouterModule, LoginComponent],
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent {}
