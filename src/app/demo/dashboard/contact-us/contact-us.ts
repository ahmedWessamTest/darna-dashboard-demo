import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IDataContactUs } from "@app/features/dashboard/contact-us/model/contact-us";
import { ContactUsService } from "@app/features/dashboard/contact-us/service/contact-us";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Editor } from "primeng/editor";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
@Component({
  selector: "app-contact-us",
  imports: [
    FileUploadModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
    Editor,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./contact-us.html",
  styleUrl: "./contact-us.scss",
})
export class ContactUs implements OnInit {
  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private router = inject(Router);

  contactUsService = inject(ContactUsService);

  contactUs!: IDataContactUs;

  contactForm!: FormGroup;

  isLoading = signal(false);

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  ngOnInit() {
    this.initForm();
    this.getContactUs();
  }

  getContactUs() {
    this.contactUsService.getContactUs().subscribe((data) => {
      const cleaned = Object.fromEntries(
      Object.entries(data.data).filter(([_, v]) => v !== "null")
    );    
console.log(cleaned);

    this.contactForm.patchValue(cleaned);
      this.contactUs = data.data;
    });
  }

  initForm() {
    this.contactForm = this.fb.group({
      en_address: ["", [Validators.required, Validators.minLength(3)]],
      ar_address: ["", [Validators.required, Validators.minLength(3)]],
      google_map_link: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      en_working_hours: ["", [Validators.required, Validators.minLength(3)]],
      ar_working_hours: ["", [Validators.required, Validators.minLength(3)]],
      main_phone: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      whatsapp_phone: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      main_email: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      facebook_link: [
        '',
        [
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      instagram_link: [
        '',
        [
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      linkedin_link: [
        '',
        [
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      twitter_link: [
        '',
        [
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      youtube_link: [
        '',
        [
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      snapchat_link: [
        '',
        [
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      telegram_link: [
        '',
        [
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      tiktok_link: [
        '',
        [
          Validators.pattern(
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/
          ),
        ],
      ],
      en_footer_text: ["", [Validators.required, Validators.minLength(3)]],
      ar_footer_text: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    console.log(this.contactForm.controls);
    if (this.contactForm.invalid) return;
    this.isLoading.set(true);
    this.contactUsService
      .updateContactUs(this.contactForm.value as IDataContactUs)
      .subscribe({
        next: (next: any) => {
          this.isLoading.set(false);
          if (next.success) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "About Us updated successfully",
            });
            this.getContactUs();
          } else {
            this.isLoading.set(false);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "About Us updated failed",
            });
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "About Us updated failed",
          });
        },
      });
  }
}
