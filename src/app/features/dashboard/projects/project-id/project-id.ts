import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { NgxJoditComponent } from "ngx-jodit";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { ImageModule } from "primeng/image";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";

import { baseUrl } from "@app/core/env";
import {
  IProjectChoicesInputData,
  IProjectGallery,
  IProjectResponse,
} from "../model";
import { ProjectsService } from "../service/projects";

interface FileUploadEvent {
  files?: File[];
  currentFiles?: File[];
  target?: {
    files: FileList;
  };
}

type GalleryUploadData = Omit<IProjectGallery, "main_image"> & {
  main_image: File;
};

type EndpointType = "project-form-first" | "project-form-second";

@Component({
  selector: "app-project-id",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FileUploadModule,
    NgxJoditComponent,
    ToastModule,
    DataViewModule,
    DialogModule,
    ImageModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule,
    SelectModule,
  ],
  templateUrl: "./project-id.html",
  styleUrl: "./project-id.scss",
  providers: [MessageService, ConfirmationService],
})
export class ProjectId implements OnInit {
  private projectService = inject(ProjectsService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  mode = signal<"create" | "edit" | "view">("create");
  projectId = signal<number | null>(null);
  isLoading = signal(false);
  project!: IProjectResponse;
  projectForm!: FormGroup;
  baseUrl = baseUrl;

  selectedMainImage: File | null = null;
  selectedBannerImage: File | null = null;

  // Gallery management signals
  galleryImages = signal<IProjectGallery[]>([]);
  selectedGalleryFiles = signal<File[]>([]);
  isGalleryLoading = signal(false);
  showGalleryUpload = signal(false);
  showEditGalleryDialog = signal(false);
  editingGalleryImage = signal<IProjectGallery | null>(null);
  selectedEditImage: File | null = null;
  galleryForm!: FormGroup;

  // Project Choices management signals
  projectChoicesFirst = signal<IProjectChoicesInputData[]>([]);
  projectChoicesSecond = signal<IProjectChoicesInputData[]>([]);
  isChoicesLoading = signal(false);
  showChoicesDialog = signal(false);
  showEditChoicesDialog = signal(false);
  editingChoice = signal<IProjectChoicesInputData | null>(null);
  currentChoicesType = signal<EndpointType>("project-form-first");
  choicesForm!: FormGroup;

  // Dropdown options for choices type
  choicesTypeOptions = [
    { label: "Form First Input", value: "project-form-first" as EndpointType },
    {
      label: "Form Second Input",
      value: "project-form-second" as EndpointType,
    },
  ];

  // Image styling
  imageStyle = { "object-fit": "cover", "border-radius": "8px" };

  isEditMode = computed(() => this.mode() === "edit");
  isCreateMode = computed(() => this.mode() === "create");
  isViewMode = computed(() => this.mode() === "view");

  // Form validation including file check for create mode
  isFormValid = computed(() => {
    if (!this.projectForm) return false;

    const formValid = this.projectForm.valid;

    // In create mode, also require main image file
    if (this.isCreateMode()) {
      return formValid && !!this.selectedMainImage;
    }
    // In edit/view mode, form validation is enough
    return formValid;
  });

  pageTitle = computed(() => {
    switch (this.mode()) {
      case "create":
        return "Create New Project";
      case "edit":
        return "Edit Project";
      case "view":
        return "View Project";
      default:
        return "Project Form";
    }
  });

  constructor() {
    // Effect to handle form enable/disable based on mode
    effect(() => {
      if (this.projectForm) {
        if (this.isViewMode()) {
          this.projectForm.disable();
        } else {
          this.projectForm.enable();
        }
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.initGalleryForm();
    this.initChoicesForm();
    this.setupRouteHandling();
  }

  private setupRouteHandling() {
    // Get route data for mode
    this.route.data.subscribe((data) => {
      const mode = data["mode"] || "create";
      this.mode.set(mode);
    });

    // Get route params for ID
    this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.projectId.set(+id);
        this.loadProjectData(+id);
      }
    });
  }

  initForm() {
    this.projectForm = this.fb.group({
      en_project_name: ["", [Validators.required]],
      ar_project_name: ["", [Validators.required]],
      en_project_title: ["", [Validators.required]],
      ar_project_title: ["", [Validators.required]],
      en_project_description: ["", [Validators.required]],
      ar_project_description: ["", [Validators.required]],
      en_small_text: ["", [Validators.required]],
      ar_small_text: ["", [Validators.required]],
      en_alt_main_image: [""],
      ar_alt_main_image: [""],
      en_alt_banner_image: [""],
      ar_alt_banner_image: [""],
      main_file_link: [""],
      google_map_link: [""],
      en_form_first_input_info: [""],
      ar_form_first_input_info: [""],
      en_form_second_input_info: [""],
      ar_form_second_input_info: [""],
      en_title_form: [""],
      ar_title_form: [""],
      en_description_form: [""],
      ar_description_form: [""],
      en_script_text: [""],
      ar_script_text: [""],
      en_meta_title: [""],
      ar_meta_title: [""],
      en_meta_description: [""],
      ar_meta_description: [""],
    });
  }

  loadProjectData(id?: number) {
    const projectId = id || this.projectId() || 1;

    this.projectService.getProject(projectId).subscribe({
      next: (data) => {
        this.project = data.data;
        console.log(this.project);
        this.projectForm.patchValue({
          en_project_name: this.project.en_project_name,
          ar_project_name: this.project.ar_project_name,
          en_project_title: this.project.en_project_title,
          ar_project_title: this.project.ar_project_title,
          en_project_description: this.project.en_project_description,
          ar_project_description: this.project.ar_project_description,
          en_small_text: this.project.en_small_text,
          ar_small_text: this.project.ar_small_text,
          en_alt_main_image: this.project.en_alt_main_image,
          ar_alt_main_image: this.project.ar_alt_main_image,
          en_alt_banner_image: this.project.en_alt_banner_image,
          ar_alt_banner_image: this.project.ar_alt_banner_image,
          main_file_link: this.project?.main_file_link,
          google_map_link: this.project.google_map_link,
          en_form_first_input_info: this.project.en_form_first_input_info,
          ar_form_first_input_info: this.project.ar_form_first_input_info,
          en_form_second_input_info: this.project.en_form_second_input_info,
          ar_form_second_input_info: this.project.ar_form_second_input_info,
          en_title_form: this.project.en_title_form,
          ar_title_form: this.project.ar_title_form,
          en_description_form: this.project.en_description_form,
          ar_description_form: this.project.ar_description_form,
          en_script_text: this.project.en_script_text,
          ar_script_text: this.project.ar_script_text,
          en_meta_title: this.project.en_meta_title,
          ar_meta_title: this.project.ar_meta_title,
          en_meta_description: this.project.en_meta_description,
          ar_meta_description: this.project.ar_meta_description,
        });

        // Load gallery images and project choices after project is loaded
        this.loadGalleryImages();
        this.loadProjectChoices();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading project data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load project data",
        });
        this.isLoading.set(false);
      },
    });
  }

  onMainImageSelect(event: FileUploadEvent) {
    let files: File[] = [];

    if (event.files && Array.isArray(event.files)) {
      files = event.files;
    } else if (event.currentFiles && Array.isArray(event.currentFiles)) {
      files = event.currentFiles;
    } else if (event.target && event.target.files) {
      files = Array.from(event.target.files);
    } else {
      return;
    }

    if (files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        this.messageService.add({
          severity: "error",
          summary: "Invalid File",
          detail: "Please select an image file",
        });
        return;
      }

      if (file.size > 5000000) {
        this.messageService.add({
          severity: "error",
          summary: "File Too Large",
          detail: "Please select an image smaller than 5MB",
        });
        return;
      }

      this.selectedMainImage = file;
      this.messageService.add({
        severity: "success",
        summary: "File Selected",
        detail: `Main image "${file.name}" selected successfully`,
      });
    }
  }

  onBannerImageSelect(event: FileUploadEvent) {
    let files: File[] = [];

    if (event.files && Array.isArray(event.files)) {
      files = event.files;
    } else if (event.currentFiles && Array.isArray(event.currentFiles)) {
      files = event.currentFiles;
    } else if (event.target && event.target.files) {
      files = Array.from(event.target.files);
    } else {
      return;
    }

    if (files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        this.messageService.add({
          severity: "error",
          summary: "Invalid File",
          detail: "Please select an image file",
        });
        return;
      }

      if (file.size > 5000000) {
        this.messageService.add({
          severity: "error",
          summary: "File Too Large",
          detail: "Please select an image smaller than 5MB",
        });
        return;
      }

      this.selectedBannerImage = file;
      this.messageService.add({
        severity: "success",
        summary: "File Selected",
        detail: `Banner image "${file.name}" selected successfully`,
      });
    }
  }

  onSubmit() {
    if (!this.isFormValid() || this.isViewMode()) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail:
          this.isCreateMode() && !this.selectedMainImage
            ? "Please select a main image file and fill all required fields"
            : "Please fill all required fields correctly",
      });
      return;
    }

    this.isLoading.set(true);
    const formData = this.projectForm.value;

    if (this.isCreateMode()) {
      this.createProject(formData);
    } else if (this.isEditMode()) {
      this.updateProject();
    }
  }

  private createProject(formData: Partial<IProjectResponse>) {
    if (!this.selectedMainImage) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select a main image file",
      });
      this.isLoading.set(false);
      return;
    }

    this.projectService
      .addUpdateProject(
        formData as IProjectResponse,
        this.selectedMainImage,
        undefined, // No project ID for creation
        this.selectedBannerImage || undefined
      )
      .subscribe({
        next: (data) => {
          console.log("Create successful:", data);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Project created successfully",
          });
          this.router.navigate(["/dashboard/projects"]);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error("Error creating project:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to create project",
          });
          this.isLoading.set(false);
        },
      });
  }

  updateProject() {
    this.isLoading.set(true);
    const formData = this.projectForm.value;

    this.projectService
      .addUpdateProject(
        formData as IProjectResponse,
        this.selectedMainImage || undefined,
        this.project.id,
        this.selectedBannerImage || undefined
      )
      .subscribe({
        next: (data) => {
          console.log("Update successful:", data);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Project updated successfully",
          });
          this.loadProjectData();
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error("Error updating project:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update project",
          });
          this.isLoading.set(false);
        },
      });
  }

  onCancel() {
    this.router.navigate(["/dashboard/projects"]);
  }

  onEditProject() {
    if (this.projectId()) {
      this.router.navigate(["../../edit", this.projectId()], {
        relativeTo: this.route,
      });
    }
  }

  // Gallery Management Methods
  initGalleryForm() {
    this.galleryForm = this.fb.group({
      // Removed alt text fields since they're not needed
    });
  }

  loadGalleryImages() {
    const id = this.projectId();
    if (!id) return;

    this.isGalleryLoading.set(true);

    this.projectService.getProjectGalleryImages(id).subscribe({
      next: (images) => {
        this.galleryImages.set(images);
        this.isGalleryLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading gallery images:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load gallery images",
        });
        this.galleryImages.set([]);
        this.isGalleryLoading.set(false);
      },
    });
  }

  onGalleryFilesSelect(event: FileUploadEvent) {
    // Handle different event structures from PrimeNG FileUpload
    let files: File[] = [];

    if (event.files && Array.isArray(event.files)) {
      files = event.files;
    } else if (event.currentFiles && Array.isArray(event.currentFiles)) {
      files = event.currentFiles;
    } else if (event.target && event.target.files) {
      // Handle native file input
      files = Array.from(event.target.files);
    } else {
      return;
    }

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        this.messageService.add({
          severity: "error",
          summary: "Invalid File",
          detail: `${file.name} is not an image file`,
        });
        return false;
      }

      if (file.size > 5000000) {
        this.messageService.add({
          severity: "error",
          summary: "File Too Large",
          detail: `${file.name} is larger than 5MB`,
        });
        return false;
      }

      return true;
    });

    this.selectedGalleryFiles.set(validFiles);

    if (validFiles.length > 0) {
      this.messageService.add({
        severity: "success",
        summary: "Files Selected",
        detail: `${validFiles.length} image(s) selected successfully`,
      });
    }
  }

  uploadGalleryImages() {
    const files = this.selectedGalleryFiles();
    const projectId = this.projectId();

    if (!files.length || !projectId) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select files to upload",
      });
      return;
    }

    this.isGalleryLoading.set(true);

    // Upload each file separately
    const uploadPromises = files.map((file) => {
      const galleryData: GalleryUploadData = {
        id: 0,
        en_alt_name: this.project.en_alt_main_image,
        ar_alt_name: this.project.ar_alt_main_image,
        main_image: file, // Pass the File object directly
        active_status: "1",
        project_id: projectId,
      };

      return this.projectService
        .addProjectGallery(galleryData as unknown as IProjectGallery)
        .toPromise();
    });

    Promise.all(uploadPromises)
      .then((responses) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: `${responses.length} image(s) uploaded successfully`,
        });
        this.selectedGalleryFiles.set([]);
        this.showGalleryUpload.set(false);
        this.loadGalleryImages();
      })
      .catch((error) => {
        console.error("Error uploading gallery images:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to upload some images",
        });
        this.isGalleryLoading.set(false);
      })
      .finally(() => {
        this.isGalleryLoading.set(false);
      });
  }

  editGalleryImage(image: IProjectGallery) {
    this.editingGalleryImage.set(image);
    this.selectedEditImage = null;
    this.showEditGalleryDialog.set(true);
  }

  onEditImageSelect(event: FileUploadEvent) {
    let files: File[] = [];

    if (event.files && Array.isArray(event.files)) {
      files = event.files;
    } else if (event.currentFiles && Array.isArray(event.currentFiles)) {
      files = event.currentFiles;
    } else if (event.target && event.target.files) {
      files = Array.from(event.target.files);
    } else {
      return;
    }

    if (files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        this.messageService.add({
          severity: "error",
          summary: "Invalid File",
          detail: "Please select an image file",
        });
        return;
      }

      if (file.size > 5000000) {
        this.messageService.add({
          severity: "error",
          summary: "File Too Large",
          detail: "Please select an image smaller than 5MB",
        });
        return;
      }

      this.selectedEditImage = file;
      this.messageService.add({
        severity: "success",
        summary: "File Selected",
        detail: `New image "${file.name}" selected successfully`,
      });
    }
  }

  updateGalleryImage() {
    const editingImage = this.editingGalleryImage();
    if (!editingImage) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "No image selected for editing",
      });
      return;
    }

    this.isGalleryLoading.set(true);

    let updatedData: IProjectGallery;

    if (this.selectedEditImage) {
      // Update with new image
      updatedData = {
        ...editingImage,
        main_image: this.selectedEditImage as unknown as string,
      };
    } else {
      // No new image, just keep existing data
      updatedData = editingImage;
    }
    console.log(updatedData);

    this.projectService
      .updateProjectGallery(editingImage.id, updatedData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Gallery image updated successfully",
          });
          this.showEditGalleryDialog.set(false);
          this.editingGalleryImage.set(null);
          this.selectedEditImage = null;
          this.loadGalleryImages();
        },
        error: (error) => {
          console.error("Error updating gallery image:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update gallery image",
          });
          this.isGalleryLoading.set(false);
        },
        complete: () => {
          this.isGalleryLoading.set(false);
        },
      });
  }

  toggleGalleryImageStatus(image: IProjectGallery) {
    const action = image.active_status === "1" ? "disable" : "activate";
    const actionMethod =
      image.active_status === "1"
        ? this.projectService.deleteImageGallery(image.id)
        : this.projectService.activeImageGallery(image.id);

    this.confirmationService.confirm({
      message: `Are you sure you want to ${action} this gallery image?`,
      header: `${action.charAt(0).toUpperCase() + action.slice(1)} Confirmation`,
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass:
        action === "disable" ? "p-button-danger" : "p-button-success",
      accept: () => {
        this.isGalleryLoading.set(true);

        actionMethod.subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: `Gallery image ${action}d successfully`,
            });
            this.loadGalleryImages();
          },
          error: (error) => {
            console.error(`Error ${action}ing gallery image:`, error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: `Failed to ${action} gallery image`,
            });
            this.isGalleryLoading.set(false);
          },
          complete: () => {
            this.isGalleryLoading.set(false);
          },
        });
      },
    });
  }

  closeGalleryUpload() {
    this.showGalleryUpload.set(false);
    this.selectedGalleryFiles.set([]);
  }

  closeEditGalleryDialog() {
    console.log("click");
    this.showEditGalleryDialog.set(false);
    this.editingGalleryImage.set(null);
    this.selectedEditImage = null;
    this.galleryForm.reset();
  }

  // Project Choices Management Methods
  initChoicesForm() {
    this.choicesForm = this.fb.group({
      en_input_info: ["", [Validators.required]],
      ar_input_info: ["", [Validators.required]],
      choices_type: ["project-form-first", [Validators.required]],
    });
  }

  loadProjectChoices() {
    const id = this.projectId();
    if (!id) return;

    this.isChoicesLoading.set(true);

    // // Load both types of project choices
    // const firstChoicesPromise = this.projectService
    //   .getProjectChoicesInputById("project-form-first", id)
    //   .toPromise();
    // const secondChoicesPromise = this.projectService
    //   .getProjectChoicesInputById("project-form-second", id)
    //   .toPromise();

    // Promise.all([firstChoicesPromise, secondChoicesPromise])
    //   .then(([firstChoices, secondChoices]) => {
    //     this.projectChoicesFirst.set(firstChoices?.data || []);
    //     this.projectChoicesSecond.set(secondChoices?.data || []);
    //     this.isChoicesLoading.set(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error loading project choices:", error);
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: "Failed to load project choices",
    //     });
    //     this.projectChoicesFirst.set([]);
    //     this.projectChoicesSecond.set([]);
    //     this.isChoicesLoading.set(false);
    //   });
    this.projectChoicesFirst.set(this.project.project_form_first || []);
    this.projectChoicesSecond.set(this.project.project_form_second || []);
    this.isChoicesLoading.set(false);
  }

  openChoicesDialog(type: EndpointType) {
    this.currentChoicesType.set(type);
    this.choicesForm.patchValue({
      choices_type: type,
    });
    this.showChoicesDialog.set(true);
  }

  addProjectChoice() {
    if (!this.choicesForm.valid) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please fill all required fields",
      });
      return;
    }

    const formData = this.choicesForm.value;
    const projectId = this.projectId();

    if (!projectId) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Project ID not found",
      });
      return;
    }

    this.isChoicesLoading.set(true);

    const choiceData = {
      id: this.projectId() || 0,
      project_id: projectId.toString(),
      en_input_info: formData.en_input_info,
      ar_input_info: formData.ar_input_info,
      active_status: this.project.active_status,
    };

    this.projectService
      .addProjectChoicesInput(formData.choices_type, choiceData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Project choice added successfully",
          });
          this.showChoicesDialog.set(false);
          this.choicesForm.reset();
          this.loadProjectChoices();
          this.loadProjectData();
        },
        error: (error) => {
          console.error("Error adding project choice:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to add project choice",
          });
          this.isChoicesLoading.set(false);
        },
        complete: () => {
          this.isChoicesLoading.set(false);
        },
      });
  }

  editProjectChoice(choice: IProjectChoicesInputData, type: EndpointType) {
    this.editingChoice.set(choice);
    this.currentChoicesType.set(type);
    this.choicesForm.patchValue({
      en_input_info: choice.en_input_info,
      ar_input_info: choice.ar_input_info,
      choices_type: type,
    });
    this.showEditChoicesDialog.set(true);
  }

  updateProjectChoice() {
    const editingChoice = this.editingChoice();
    if (!editingChoice || !this.choicesForm.valid) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please fill all required fields",
      });
      return;
    }

    this.isChoicesLoading.set(true);
    const formData = this.choicesForm.value;

    const updatedData = {
      ...editingChoice,
      en_input_info: formData.en_input_info,
      ar_input_info: formData.ar_input_info,
    };

    this.projectService
      .updateProjectChoicesInput(
        formData.choices_type,
        editingChoice.id,
        updatedData
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Project choice updated successfully",
          });
          this.showEditChoicesDialog.set(false);
          this.editingChoice.set(null);
          this.choicesForm.reset();
          this.loadProjectChoices();
          this.loadProjectData();
        },
        error: (error) => {
          console.error("Error updating project choice:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update project choice",
          });
          this.isChoicesLoading.set(false);
        },
        complete: () => {
          this.isChoicesLoading.set(false);
        },
      });
  }

  toggleProjectChoiceStatus(
    choice: IProjectChoicesInputData,
    type: EndpointType
  ) {
    const action = choice.active_status === "1" ? "disable" : "activate";
    const actionMethod =
      choice.active_status === "1"
        ? this.projectService.deleteProjectChoicesInput(type, choice.id)
        : this.projectService.activeProjectChoicesInput(type, choice.id);

    this.confirmationService.confirm({
      message: `Are you sure you want to ${action} this project choice?`,
      header: `${action.charAt(0).toUpperCase() + action.slice(1)} Confirmation`,
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass:
        action === "disable" ? "p-button-danger" : "p-button-success",
      accept: () => {
        this.isChoicesLoading.set(true);

        actionMethod.subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: `Project choice ${action}d successfully`,
            });
            this.loadProjectChoices();
            this.loadProjectData();
          },
          error: (error) => {
            console.error(`Error ${action}ing project choice:`, error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: `Failed to ${action} project choice`,
            });
            this.isChoicesLoading.set(false);
          },
          complete: () => {
            this.isChoicesLoading.set(false);
          },
        });
      },
    });
  }

  closeChoicesDialog() {
    this.showChoicesDialog.set(false);
    this.choicesForm.reset();
  }

  closeEditChoicesDialog() {
    this.showEditChoicesDialog.set(false);
    this.editingChoice.set(null);
    this.choicesForm.reset();
  }

  // Computed getters for current choices based on type
  getCurrentChoices() {
    const type = this.currentChoicesType();
    return type === "project-form-first"
      ? this.projectChoicesFirst()
      : this.projectChoicesSecond();
  }

  getAllChoicesFirst() {
    return this.projectChoicesFirst();
  }

  getAllChoicesSecond() {
    return this.projectChoicesSecond();
  }
}
