import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { ProjectService } from '../../../services/project.service';
import { PublicService } from '../../../services/public.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {
  articles: Article[] = [];
  projects: any[] = [];
  teams: any[] = [];
  
  loading = false;
  error = '';
  success = '';
  
  currentUser: any = null;
  isAdmin = false;
  
  // Expose Math for template
  Math = Math;
  
  // Filters
  selectedStatus: string = '';
  selectedVisibility: string = '';
  selectedTeam: number | null = null;
  selectedProject: number | null = null;
  searchText = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalArticles = 0;
  articlesPerPage = 20;
  
  // Modal for create/edit
  showArticleModal = false;
  editMode = false;
  currentArticle: Partial<Article> = {};
  
  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private projectService: ProjectService,
    private publicService: PublicService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';
    
    this.loadProjects();
    this.loadTeams();
    this.loadArticles();
    
    // Check if we should open edit modal from query params
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        const articleId = parseInt(params['edit']);
        this.loadArticleForEdit(articleId);
      }
    });
  }
  
  loadArticleForEdit(id: number): void {
    this.articleService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.openEditModal(response.data);
          // Remove query param from URL
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
          });
        }
      },
      error: (err) => {
        console.error('Error loading article for edit:', err);
        this.error = 'Unable to load article for editing.';
      }
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        if (response.success) {
          this.projects = response.data;
        }
      },
      error: (err) => console.error('Error loading projects:', err)
    });
  }

  loadTeams(): void {
    this.publicService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
      },
      error: (err) => console.error('Error loading teams:', err)
    });
  }

  loadArticles(): void {
    this.loading = true;
    this.error = '';

    const filters: any = {
      page: this.currentPage,
      limit: this.articlesPerPage
    };

    if (this.selectedStatus) filters.status = this.selectedStatus;
    if (this.selectedVisibility) filters.visibility = this.selectedVisibility;
    if (this.selectedTeam) filters.teamId = this.selectedTeam;
    if (this.selectedProject) filters.projectId = this.selectedProject;
    if (this.searchText.trim()) filters.search = this.searchText.trim();

    this.articleService.getAllArticles(filters).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.articles = response.data.articles;
          this.totalArticles = response.data.totalArticles;
          this.currentPage = response.data.currentPage;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error loading articles.';
        console.error('Error loading articles:', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadArticles();
  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.selectedVisibility = '';
    this.selectedTeam = null;
    this.selectedProject = null;
    this.searchText = '';
    this.currentPage = 1;
    this.loadArticles();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadArticles();
    }
  }

  openCreateModal(): void {
    this.editMode = false;
    this.currentArticle = {
      title: '',
      authors: '',
      abstract: '',
      keywords: '',
      publicationDate: '',
      journal: '',
      doi: '',
      pdfUrl: '',
      status: 'draft',
      visibility: 'members_only',
      projectId: null,
      teamId: null
    };
    this.showArticleModal = true;
  }

  openEditModal(article: Article): void {
    this.editMode = true;
    this.currentArticle = { ...article };
    this.showArticleModal = true;
  }

  closeModal(): void {
    this.showArticleModal = false;
    this.currentArticle = {};
    this.error = '';
    this.success = '';
  }

  saveArticle(): void {
    this.error = '';
    this.success = '';

    if (!this.currentArticle.title || !this.currentArticle.authors) {
      this.error = 'Title and authors are required.';
      return;
    }

    const operation = this.editMode
      ? this.articleService.update(this.currentArticle.id!, this.currentArticle)
      : this.articleService.create(this.currentArticle);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.success = this.editMode ? 'Article updated successfully!' : 'Article created successfully!';
          this.loadArticles();
          setTimeout(() => this.closeModal(), 1500);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error saving article.';
        console.error('Error saving article:', err);
      }
    });
  }

  deleteArticle(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      this.articleService.delete(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.success = 'Article deleted successfully!';
            this.loadArticles();
            setTimeout(() => this.success = '', 3000);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Error deleting article.';
          console.error('Error deleting article:', err);
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  viewArticleDetail(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/articles', id]);
    }
  }

  getStatusClass(status: string): string {
    return this.articleService.getStatusClass(status);
  }

  getVisibilityClass(visibility: string): string {
    return this.articleService.getVisibilityClass(visibility);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goBack(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
