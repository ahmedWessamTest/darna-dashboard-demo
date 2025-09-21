import { Routes } from "@angular/router";

export const contactUsFormRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@demo/dashboard/contact-us-form/contact-us-form").then(
        (c) => c.ContactUsForm
      ),
  },
  {
    path: "view/:id",
    loadComponent: () =>
      import(
        "@app/features/dashboard/contact-us-form-id/contact-us-form-id/contact-us-form-id"
      ).then((c) => c.ContactUsFormId),
  },
];
