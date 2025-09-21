import { DatePipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IContactUsForm } from "@app/features/dashboard/contact-us-form-id/model";
import { ContactUsFormService } from "@app/features/dashboard/contact-us-form-id/service/contact-us-form";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";
import { SelectModule } from "primeng/select";

@Component({
  selector: "app-contact-us-form",
  imports: [TableSharedModule, SelectModule, DatePipe],
  templateUrl: "./contact-us-form.html",
  styleUrl: "./contact-us-form.scss",
})
export class ContactUsForm implements OnInit {
  private route = inject(ActivatedRoute);

  contactUsForm!: IContactUsForm[];
  allContactUsForm!: IContactUsForm[]; // Store original data

  baseUrl = baseUrl;

  contactUsFormService = inject(ContactUsFormService);

  // Read status options for dropdown
  readStatusOptions = [
    { label: "Read", value: 1 },
    { label: "Unread", value: 0 },
  ];

  // Selected read filter
  selectedReadFilter: number | null = null;

  getMode() {
    const mode = this.route.snapshot.queryParamMap.get("mode");
    return mode;
  }

  getSliderId() {
    const id = this.route.snapshot.queryParamMap.get("id");
    return id;
  }

  ngOnInit() {
    this.contactUsFormService.getContactUsForm().subscribe((data) => {
      this.allContactUsForm = data.data; // Store original data
      this.contactUsForm = data.data;
    });
  }

  // Handle read status filter change
  onReadFilter(statusValue: number | null) {
    if (statusValue === null || statusValue === undefined) {
      // Show all contact us forms when filter is cleared
      this.contactUsForm = [...this.allContactUsForm];
    } else {
      // Filter contact us forms by read status
      this.contactUsForm = this.allContactUsForm.filter(
        (form) => Number(form.is_read) === Number(statusValue)
      );
    }
  }
}
