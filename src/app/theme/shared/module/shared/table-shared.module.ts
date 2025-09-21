import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { ToggleSwitch } from "primeng/toggleswitch";

@NgModule({
  declarations: [],
  imports: [
    TableModule,
    RouterLink,
    FormsModule,
    ToggleSwitch,
    SkeletonModule,
    ButtonModule,
    RouterLink,
    ToggleSwitch,
  ],
  exports: [
    TableModule,
    RouterLink,
    FormsModule,
    ToggleSwitch,
    SkeletonModule,
    ButtonModule,
    ToggleSwitch,
    RouterLink,
    ToggleSwitch,
  ],
})
export class TableSharedModule {}
