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
import { IAboutData } from "@app/features/dashboard/about-us/models/about-us";
import { AboutUService } from "@app/features/dashboard/about-us/services/about-us";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Editor } from "primeng/editor";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
@Component({
  selector: "app-about-us",
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
  templateUrl: "./about-us.html",
  styleUrl: "./about-us.scss",
})
export class AboutUs implements OnInit {
  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private router = inject(Router);

  aboutUsService = inject(AboutUService);

  aboutUs!: IAboutData;

  aboutForm!: FormGroup;

  isLoading = signal(false);

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  ngOnInit() {
    this.initForm();
    this.getAboutUs();
  }

  getAboutUs() {
    this.aboutUsService.getAboutUs().subscribe((data) => {
      this.aboutForm.patchValue(data.data);
      this.aboutUs = data.data;
    });
  }

  initForm() {
    this.aboutForm = this.fb.group({
      en_main_title: ["", [Validators.required, Validators.minLength(3)]],
      ar_main_title: ["", [Validators.required, Validators.minLength(3)]],
      en_main_text: ["", [Validators.required, Validators.minLength(3)]],
      ar_main_text: ["", [Validators.required, Validators.minLength(3)]],
      en_alt_image: ["", [Validators.required]],
      ar_alt_image: ["", [Validators.required]],
    });
  }

  onImageSelect(event: { files?: File[]; currentFiles?: File[] }) {
    console.log(event);
    const files = event.files || event.currentFiles;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        this.messageService.add({
          severity: "error",
          summary: "Invalid File",
          detail: "Please select an image file",
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5000000) {
        this.messageService.add({
          severity: "error",
          summary: "File Too Large",
          detail: "Please select an image smaller than 5MB",
        });
        return;
      }

      // Store the file directly without conversion
      this.selectedFile = file;

      this.messageService.add({
        severity: "success",
        summary: "File Selected",
        detail: `Image "${file.name}" selected successfully`,
      });
    }
  }

  onSubmit() {
    if (this.aboutForm.invalid) return;
    this.isLoading.set(true);
    this.aboutUsService
      .updateAboutUs(
        this.aboutForm.value as IAboutData,
        this.selectedFile || undefined
      )
      .subscribe((next: any) => {
        this.isLoading.set(false);
        if (next.success) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "About Us updated successfully",
          });
          this.getAboutUs();
        } else {
          this.isLoading.set(false);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "About Us updated failed",
          });
        }
      });
  }
}
