import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";

@NgModule({
  declarations: [],
  imports: [
    FileUploadModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TagModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FileUploadModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TagModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DetailsSharedModule {}
