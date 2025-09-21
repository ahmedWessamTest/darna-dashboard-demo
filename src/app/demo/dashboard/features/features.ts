import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { IFeature } from "../../../features/dashboard/features/models";
import { Feature } from "../../../features/dashboard/features/services/feature";
@Component({
  selector: "app-features",
  imports: [TableModule, RouterLink, FormsModule, SkeletonModule, ButtonModule],
  templateUrl: "./features.html",
  styleUrl: "./features.scss",
})
export class Features implements OnInit {
  private route = inject(ActivatedRoute);

  features!: IFeature[];

  baseUrl = baseUrl;

  featureService = inject(Feature);

  checked: boolean = false;

  getMode() {
    const mode = this.route.snapshot.queryParamMap.get("mode");
    return mode;
  }

  getSliderId() {
    const id = this.route.snapshot.queryParamMap.get("id");
    return id;
  }

  ngOnInit() {
    this.featureService.getfeatures().subscribe((data) => {
      this.features = data.data;
    });
  }
  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }
}
