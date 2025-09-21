// Angular import
import { Component, HostListener, OnInit, output } from "@angular/core";

// project import
import { BerryConfig } from "src/app/app-config";

import { NavLeftComponent } from "./nav-left/nav-left.component";
import { NavLogoComponent } from "./nav-logo/nav-logo.component";

@Component({
  selector: "app-nav-bar",
  imports: [NavLogoComponent, NavLeftComponent],
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit {
  // public props
  NavCollapse = output();
  NavCollapsedMob = output();
  navCollapsed: boolean;
  windowWidth: number;
  navCollapsedMob: boolean;

  // Constructor
  constructor() {
    this.windowWidth = window.innerWidth;
    this.navCollapsed =
      this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  ngOnInit() {
    this.updateWindowWidth();
  }

  // Listen for window resize events
  @HostListener("window:resize")
  onResize() {
    this.updateWindowWidth();
  }

  // Update window width and navigation state
  private updateWindowWidth() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 1025) {
      this.navCollapsedMob = false;
      this.navCollapsed = BerryConfig.isCollapse_menu;
    } else {
      this.navCollapsed = false;
    }
  }

  // public method
  navCollapse() {
    if (this.windowWidth >= 1025) {
      console.log("navCollapse");
      this.navCollapsed = !this.navCollapsed;
      this.NavCollapse.emit();
    }
  }

  navCollapseMob() {
    if (this.windowWidth < 1025) {
      console.log("navCollapseMob");
      this.NavCollapsedMob.emit();
    }
  }
}
