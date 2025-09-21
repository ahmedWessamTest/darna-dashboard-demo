import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { DetailsSharedModule } from "@app/theme/shared/module/shared/details-shared.module";
import { MessageService } from "primeng/api";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { IContactUsForm } from "../model";
import { ContactUsFormService } from "../service/contact-us-form";

@Component({
  selector: "app-contact-us-form-id",
  imports: [DetailsSharedModule, ProgressSpinnerModule],
  templateUrl: "./contact-us-form-id.html",
  styleUrl: "./contact-us-form-id.scss",
})
export class ContactUsFormId implements OnInit {
  private contactUsFormService = inject(ContactUsFormService);

  private messageService = inject(MessageService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  contactUsFormId = signal<number | null>(null);

  isLoading = signal(false);

  contactUsForm = signal<IContactUsForm | null>(null);

  baseUrl = baseUrl;

  ngOnInit() {
    this.setupRouteHandling();
  }

  private setupRouteHandling() {
    // Get route params for ID
    this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.contactUsFormId.set(+id);
        this.loadContactUsFormData(+id);
      }
    });
  }

  loadContactUsFormData(id?: number) {
    const contactUsFormId = id || this.contactUsFormId() || 1;
    this.isLoading.set(true);

    this.contactUsFormService.getContactUsFormById(contactUsFormId).subscribe({
      next: (data) => {
        this.contactUsForm.set(data.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading contact form data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load contact form data",
        });
        this.isLoading.set(false);
      },
    });
  }

  onBack() {
    this.router.navigate(["/dashboard/contact-us-form"]);
  }
}
