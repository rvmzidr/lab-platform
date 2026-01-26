// Projects Component TypeScript
// Manages project listing, creation, and basic operations

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { InstitutionService } from '../../services/institution.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.model';
import { Institution } from '../../models/institution.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  institutions: Institution[] = [];
  loading = false;
  error = '';
  success = '';
  
  // Modal state
  showCreateModal = false;
  
  // Form data
  newProject = {
    name: '',
    source: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: null as number | null,
    institutionId: null as number | null,
    projectManagerId: null as number | null
  };
  
  // Current user info
  currentUser: any = null;
  isAdmin = false;

  constructor(
    private projectService: ProjectService,
    private institutionService: InstitutionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';
    this.loadProjects();
    this.loadInstitutions();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';
    
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        if (response.success) {
          this.projects = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load projects: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  loadInstitutions(): void {
    this.institutionService.getAllInstitutions().subscribe({
      next: (response) => {
        if (response.success) {
          this.institutions = response.data;
        }
      },
      error: (err) => {
        console.error('Failed to load institutions:', err);
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.resetForm();
    this.error = '';
    this.success = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newProject = {
      name: '',
      source: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: null,
      institutionId: null,
      projectManagerId: null
    };
  }

  createProject(): void {
    // Validate required fields
    if (!this.newProject.name || !this.newProject.source || !this.newProject.institutionId) {
      this.error = 'Please fill in all required fields (Name, Source, Institution)';
      return;
    }

    this.loading = true;
    this.error = '';

    const projectData: any = {
      name: this.newProject.name,
      source: this.newProject.source,
      institutionId: this.newProject.institutionId
    };

    if (this.newProject.description) projectData.description = this.newProject.description;
    if (this.newProject.startDate) projectData.startDate = this.newProject.startDate;
    if (this.newProject.endDate) projectData.endDate = this.newProject.endDate;
    if (this.newProject.budget) projectData.budget = this.newProject.budget;
    if (this.newProject.projectManagerId) projectData.projectManagerId = this.newProject.projectManagerId;

    this.projectService.createProject(projectData).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Project created successfully!';
          this.loadProjects();
          setTimeout(() => {
            this.closeCreateModal();
            this.success = '';
          }, 1500);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create project: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  deleteProject(id: number): void {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated purchase requests.')) {
      return;
    }

    this.projectService.deleteProject(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Project deleted successfully';
          this.loadProjects();
          setTimeout(() => this.success = '', 3000);
        }
      },
      error: (err) => {
        this.error = 'Failed to delete project: ' + (err.error?.message || err.message);
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  goBack(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
