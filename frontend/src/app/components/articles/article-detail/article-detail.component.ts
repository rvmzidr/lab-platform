import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  loading = false;
  error = '';
  currentUser: any = null;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadArticle(parseInt(id));
    }
  }

  loadArticle(id: number): void {
    this.loading = true;
    this.error = '';

    this.articleService.getById(id).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.article = response.data;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error loading article.';
        console.error('Error loading article:', err);
      }
    });
  }

  goBack(): void {
    const targetUrl = this.authService.isAuthenticated() ? '/dashboard/articles' : '/articles';
    this.router.navigateByUrl(targetUrl);
  }

  editArticle(): void {
    if (this.article?.id) {
      this.router.navigate(['/dashboard/articles'], { 
        queryParams: { edit: this.article.id }
      });
    }
  }

  openPdf(): void {
    if (this.article?.pdfUrl) {
      window.open(this.article.pdfUrl, '_blank');
    }
  }

  openDoi(): void {
    const doiUrl = this.articleService.getDoiUrl(this.article?.doi);
    if (doiUrl) {
      window.open(doiUrl, '_blank');
    }
  }

  viewProject(): void {
    if (this.article?.projectId) {
      this.router.navigate(['/dashboard/projects']);
    }
  }

  getDoiUrl(): string | null {
    return this.articleService.getDoiUrl(this.article?.doi);
  }

  getStatusClass(): string {
    return this.article ? this.articleService.getStatusClass(this.article.status) : '';
  }

  getVisibilityClass(): string {
    return this.article ? this.articleService.getVisibilityClass(this.article.visibility) : '';
  }
}
