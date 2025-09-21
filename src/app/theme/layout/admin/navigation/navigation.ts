export interface NavigationItem {
  id: string;
  title: string;
  type: "item" | "collapse" | "group";
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: "website-management",
    title: "Website Management",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "homepage",
        title: "Homepage",
        type: "collapse",
        classes: "nav-item",
        icon: "ti ti-home",
        children: [
          {
            id: "hero-section",
            title: "Hero Section",
            type: "item",
            classes: "nav-item",
            url: "dashboard",
            icon: "ti ti-layout-dashboard",
          },
          {
            id: "features-section",
            title: "Features Section",
            type: "item",
            classes: "nav-item",
            url: "dashboard/features",
            icon: "pi pi-sparkles",
          },
          {
            id: "testimonials-section",
            title: "Testimonials",
            type: "item",
            classes: "nav-item",
            url: "dashboard/testimonials",
            icon: "pi pi-comments",
          },
          {
            id: "partners-section",
            title: "Partners Section",
            type: "item",
            classes: "nav-item",
            url: "dashboard/partners",
            icon: "ti ti-users",
          },
        ],
      },
      {
        id: "about-section",
        title: "About Us Section",
        type: "item",
        classes: "nav-item",
        url: "dashboard/about-us",
        icon: "ti ti-info-circle",
      },
    ],
  },

  // 3. CONTENT MANAGEMENT - Dynamic content creation
  {
    id: "content-management",
    title: "Content Management",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "blog-management",
        title: "Blog Posts",
        type: "item",
        classes: "nav-item",
        url: "dashboard/blogs",
        icon: "pi pi-globe",
      },
      {
        id: "project-management",
        title: "Project Portfolio",
        type: "item",
        classes: "nav-item",
        url: "dashboard/projects",
        icon: "ti ti-building",
      },
      {
        id: "banner-management",
        title: "Banners & Promotions",
        type: "item",
        classes: "nav-item",
        url: "dashboard/banners",
        icon: "pi pi-image",
      },
      {
        id: "job-postings",
        title: "Job Postings",
        type: "item",
        classes: "nav-item",
        url: "dashboard/careers",
        icon: "ti ti-clipboard-list",
      },
    ],
  },

  // 4. COMMUNICATIONS - All forms and contact methods
  {
    id: "communications",
    title: "Communications",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "contact-info",
        title: "Contact Information",
        type: "item",
        classes: "nav-item",
        url: "dashboard/contact-us",
        icon: "ti ti-address-book",
      },
    ],
  },

  // 5. HUMAN RESOURCES - Recruitment and careers
  {
    id: "human-resources",
    title: "Forms",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "job-applications",
        title: "Job Applications",
        type: "item",
        classes: "nav-item",
        url: "dashboard/careers-form",
        icon: "ti ti-file-cv",
      },
      {
        id: "project-form",
        title: "Project Form",
        type: "item",
        classes: "nav-item",
        url: "dashboard/project-form",
        icon: "ti ti-file-cv",
      },
      {
        id: "contact-submissions",
        title: "Contact Form ",
        type: "item",
        classes: "nav-item",
        url: "dashboard/contact-us-form",
        icon: "ti ti-inbox",
      },
    ],
  },

  // 6. COMPANY PAGES - Static informational pages
  {
    id: "company-pages",
    title: "Company Pages",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "about-page-full",
        title: "About Page (Full)",
        type: "item",
        classes: "nav-item",
        url: "dashboard/about-page",
        icon: "ti ti-building-store",
      },
      {
        id: "privacy-policy-page",
        title: "Privacy Policy",
        type: "item",
        classes: "nav-item",
        url: "dashboard/privacy-policy",
        icon: "pi pi-lock",
      },
    ],
  },

  // 7. WEBSITE TOOLS - SEO, Analytics, and utilities
  {
    id: "website-tools",
    title: "Website Tools",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "seo-management",
        title: "SEO Management",
        type: "item",
        classes: "nav-item",
        url: "dashboard/seo",
        icon: "pi pi-search",
      },
      {
        id: "counter-widgets",
        title: "Counter Widgets",
        type: "item",
        classes: "nav-item",
        url: "dashboard/counters",
        icon: "pi pi-hashtag",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "logout",
        title: "Logout",
        type: "item",
        classes: "nav-item",
        icon: "pi pi-sign-out",
        url: "",
      },
    ],
  },
];
