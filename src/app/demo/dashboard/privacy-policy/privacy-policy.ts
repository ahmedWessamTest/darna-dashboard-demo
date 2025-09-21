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
import { IPrivacyPolicy } from "@app/features/dashboard/privacy-policy/model";
import { PrivacyPolicyService } from "@app/features/dashboard/privacy-policy/services/privacy-policy";
import { NgxJoditComponent } from "ngx-jodit";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-privacy-policy",
  imports: [
    FileUploadModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
    NgxJoditComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./privacy-policy.html",
  styleUrl: "./privacy-policy.scss",
})
export class PrivacyPolicy implements OnInit {
  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private router = inject(Router);

  privacyPolicyService = inject(PrivacyPolicyService);

  privacyPolicy!: IPrivacyPolicy;

  privacyPolicyForm!: FormGroup;

  isLoading = signal(false);

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  ngOnInit() {
    this.initForm();
    this.getPrivacyPolicy();
  }

  getPrivacyPolicy() {
    this.privacyPolicyService.getPrivacyPolicy().subscribe((data) => {
      this.privacyPolicyForm.patchValue(data.data);
      this.privacyPolicy = data.data;
    });
  }

  initForm() {
    this.privacyPolicyForm = this.fb.group({
      en_title: ["", [Validators.required, Validators.minLength(3)]],
      ar_title: ["", [Validators.required, Validators.minLength(3)]],
      en_description: ["", [Validators.required, Validators.minLength(3)]],
      ar_description: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.privacyPolicyForm.invalid) return;
    this.isLoading.set(true);
    this.privacyPolicyService
      .updatePrivacyPolicy(this.privacyPolicyForm.value as IPrivacyPolicy)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Privacy Policy updated successfully",
          });
          this.getPrivacyPolicy();
        },
        error: () => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Privacy Policy updated failed",
          });
        },
      });
  }
}
