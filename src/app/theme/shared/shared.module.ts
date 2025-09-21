// Angular Imports
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// project import
import { CardComponent } from "./components/card/card.component";

// third party
import { NgScrollbarModule } from "ngx-scrollbar";

// bootstrap import
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgbCollapseModule,
    NgScrollbarModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbCollapseModule,
    NgScrollbarModule,
  ],
  declarations: [],
})
export class SharedModule {}
