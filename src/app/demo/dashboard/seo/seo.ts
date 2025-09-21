import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { ISeoData } from "@app/features/dashboard/seo/model";
import { SeoService } from "@app/features/dashboard/seo/service/seo";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";

@Component({
  selector: "app-seo",
  imports: [TableSharedModule],
  templateUrl: "./seo.html",
  styleUrl: "./seo.scss",
})
export class Seo implements OnInit {
  private route = inject(ActivatedRoute);

  seo!: ISeoData[];

  baseUrl = baseUrl;

  seoService = inject(SeoService);

  getMode() {
    const mode = this.route.snapshot.queryParamMap.get("mode");
    return mode;
  }

  getSliderId() {
    const id = this.route.snapshot.queryParamMap.get("id");
    return id;
  }

  ngOnInit() {
    this.seoService.getSeoList().subscribe((data) => {
      this.seo = data.data;
    });
  }
}
