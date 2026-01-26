import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { PublicService } from '../../../services/public.service';
import { AuthService } from '../../../services/auth.service';
import { Article, ArticleFilters } from '../../../models/article.model';

@Component({
  selector: 'app-public-articles',
  templateUrl: './public-articles.component.html',
  styleUrls: ['./public-articles.component.css']
})
export class PublicArticlesComponent implements OnInit {
  articles: Article[] = [];
  teams: any[] = [];
  loading = false;
  error = '';
  
  // Expose Math for template
  Math = Math;
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalArticles = 0;
  articlesPerPage = 9; // 3x3 grid

  // Filters
  selectedYear: number | null = null;
  selectedTeam: number | null = null;
  searchText = '';
  availableYears: number[] = [];

  constructor(
    private articleService: ArticleService,
    private publicService: PublicService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.generateYearRange();
    this.loadArticles();
  }

  /**
   * Load all research teams for filter dropdown
   */
  loadTeams(): void {
    this.publicService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
      }
    });
  }

  /**
   * Generate year range for filter (current year - 10 to current year + 1)
   */
  generateYearRange(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 1; year >= currentYear - 10; year--) {
      this.availableYears.push(year);
    }
  }

  /**
   * Load public articles with current filters
   */
  loadArticles(): void {
    this.loading = true;
    this.error = '';

    const filters: ArticleFilters = {
      page: this.currentPage,
      limit: this.articlesPerPage
    };

    if (this.selectedYear) filters.year = this.selectedYear;
    if (this.selectedTeam) filters.teamId = this.selectedTeam;
    if (this.searchText.trim()) filters.search = this.searchText.trim();

    this.articleService.getPublicArticles(filters).subscribe({
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
        this.error = 'Error loading articles. Please try again later.';
        console.error('Error loading articles:', err);
      }
    });
  }

  /**
   * Apply filters and reset to first page
   */
  applyFilters(): void {
    this.currentPage = 1;
    this.loadArticles();
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.selectedYear = null;
    this.selectedTeam = null;
    this.searchText = '';
    this.currentPage = 1;
    this.loadArticles();
  }

  /**
   * Navigate to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadArticles();
    }
  }

  /**
   * Navigate to article detail page
   */
  viewArticleDetail(articleId: number | undefined): void {
    if (articleId) {
      this.router.navigate(['/articles', articleId]);
    }
  }

  /**
   * Open PDF in new tab
   */
  openPdf(pdfUrl: string | undefined): void {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  }

  /**
   * Open DOI link in new tab
   */
  openDoi(doi: string | undefined): void {
    const doiUrl = this.articleService.getDoiUrl(doi);
    if (doiUrl) {
      window.open(doiUrl, '_blank');
    }
  }

  /**
   * Format authors for display
   */
  formatAuthors(authors: string): string {
    return this.articleService.formatAuthors(authors, 60);
  }

  /**
   * Get publication year
   */
  getYear(dateString: string | undefined): string {
    return this.articleService.getPublicationYear(dateString);
  }

  /**
   * Get team name by ID
   */
  getTeamName(teamId: number | null | undefined): string {
    if (!teamId) return '';
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.name : '';
  }

  /**
   * Get page numbers for pagination display
   */
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
