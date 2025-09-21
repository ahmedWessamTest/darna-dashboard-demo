import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { NotificationsComponent } from "@shared/components/notifications/notifications.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [
    RouterOutlet,
    ToastModule,
    NotificationsComponent,
    NgxSpinnerModule,
  ],
  schemas: [],
})
export class AppComponent {
  title = "Berry Angular Free Version";
}
