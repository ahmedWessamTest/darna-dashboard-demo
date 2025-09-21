import { Routes } from "@angular/router";

export const dashboardRoutes: Routes = [
  // {
  //   path: "",
  //   loadComponent: () =>
  //     import("@demo/dashboard/default/default.component").then(
  //       (c) => c.DefaultComponent
  //     ),
  // },
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@demo/dashboard/hero/hero").then((c) => c.Hero),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import("@demo/dashboard/hero-details/hero-details").then(
            (c) => c.HeroDetails
          ),
        data: { mode: "view" },
      },
      {
        path: "create",
        loadComponent: () =>
          import("@demo/dashboard/hero-details/hero-details").then(
            (c) => c.HeroDetails
          ),
        data: { mode: "create" },
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import("@demo/dashboard/hero-details/hero-details").then(
            (c) => c.HeroDetails
          ),
        data: { mode: "edit" },
      },
    ],
  },
  /* Tables */
  {
    path: "about-page",
    loadComponent: () =>
      import("@demo/dashboard/about-page/about-page").then((c) => c.AboutPage),
  },
  /* Tables */
  {
    path: "about-us",
    loadComponent: () =>
      import("@demo/dashboard/about-us/about-us").then((c) => c.AboutUs),
  },
  /* Tables */
  {
    path: "features",
    loadChildren: () =>
      import("@features/dashboard/features/features.routes").then(
        (c) => c.featuresRoutes
      ),
  },
  /* Tables */
  {
    path: "partners",
    loadChildren: () =>
      import("@features/dashboard/partners/partners.routes").then(
        (c) => c.partnersRoutes
      ),
  },

  {
    path: "projects",
    loadComponent: () =>
      import("@demo/dashboard/projects/projects").then((c) => c.Projects),
  },

  {
    path: "contact-us",
    loadComponent: () =>
      import("@demo/dashboard/contact-us/contact-us").then((c) => c.ContactUs),
  },
  {
    path: "testimonials",
    loadChildren: () =>
      import("@features/dashboard/testimonials/testimonials.route").then(
        (c) => c.testimonialsRoutes
      ),
  },
  {
    path: "projects",
    loadComponent: () =>
      import("@demo/dashboard/projects/projects").then((c) => c.Projects),
  },

  {
    path: "banners",
    loadChildren: () =>
      import("@app/features/dashboard/banners/banners.routes").then(
        (c) => c.bannersRoutes
      ),
  },

  {
    path: "careers",
    loadChildren: () =>
      import("@app/features/dashboard/careers/careers.routes").then(
        (c) => c.careersRoutes
      ),
  },

  {
    path: "blogs",
    loadChildren: () =>
      import("@app/features/dashboard/blogs/blog.route").then(
        (c) => c.blogRoutes
      ),
  },
  {
    path: "privacy-policy",
    loadComponent: () =>
      import("@demo/dashboard/privacy-policy/privacy-policy").then(
        (c) => c.PrivacyPolicy
      ),
  },
  {
    path: "counters",
    loadChildren: () =>
      import("@app/features/dashboard/counter/counter.routes").then(
        (c) => c.counterRoutes
      ),
  },
  {
    path: "seo",
    loadChildren: () =>
      import("@app/features/dashboard/seo/seo.route").then((c) => c.seoRoutes),
  },

  {
    path: "careers-form",
    loadChildren: () =>
      import("@app/features/dashboard/careers-form/careeers.route").then(
        (c) => c.careersRoute
      ),
  },

  {
    path: "projects",
    loadChildren: () =>
      import("@app/features/dashboard/projects/project.routes").then(
        (c) => c.projectsRoutes
      ),
  },
  {
    path: "contact-us-form",
    loadChildren: () =>
      import(
        "@app/features/dashboard/contact-us-form-id/contact-us-form.routes"
      ).then((c) => c.contactUsFormRoutes),
  },
  {
    path: "project-form",
    loadChildren: () =>
      import(
        "@app/features/dashboard/project-form-id/res/project-form.routes"
      ).then((c) => c.projectFormRoute),
  },
];
