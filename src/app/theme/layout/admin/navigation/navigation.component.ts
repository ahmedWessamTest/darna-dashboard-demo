// Angular import
import { Component, HostListener, OnInit, output } from "@angular/core";
import { RouterModule } from "@angular/router";

// project import

import { NavLeftComponent } from "../nav-bar/nav-left/nav-left.component";
import { NavContentComponent } from "./nav-content/nav-content.component";

@Component({
  selector: "app-navigation",
  imports: [NavContentComponent, RouterModule, NavLeftComponent],
  templateUrl: "./navigation.component.html",
  styleUrl: "./navigation.component.scss",
})
export class NavigationComponent implements OnInit {
  // public props
  NavCollapsedMob = output();
  SubmenuCollapse = output();
  navCollapsedMob = false;
  windowWidth = window.innerWidth;
  themeMode!: string;

  ngOnInit() {
    this.updateWindowWidth();
  }

  // Listen for window resize events
  @HostListener("window:resize")
  onResize() {
    this.updateWindowWidth();
  }

  // Update window width
  private updateWindowWidth() {
    this.windowWidth = window.innerWidth;
  }

  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  navSubmenuCollapse() {
    document
      .querySelector("app-navigation.coded-navbar")
      ?.classList.add("coded-trigger");
  }
}
