import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IBannerData } from "@app/features/dashboard/banners/model";
import { BannersService } from "@app/features/dashboard/banners/service/banners";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";

@Component({
  selector: "app-banners",
  imports: [TableSharedModule],
  templateUrl: "./banners.html",
  styleUrl: "./banners.scss",
})
export class Banners implements OnInit {
  private route = inject(ActivatedRoute);

  banners!: IBannerData[];

  baseUrl = baseUrl;

  partnersService = inject(BannersService);

  getMode() {
    const mode = this.route.snapshot.queryParamMap.get("mode");
    return mode;
  }

  getSliderId() {
    const id = this.route.snapshot.queryParamMap.get("id");
    return id;
  }

  ngOnInit() {
    this.partnersService.getBanners().subscribe((data) => {
      this.banners = data.data;
    });
  }
}
