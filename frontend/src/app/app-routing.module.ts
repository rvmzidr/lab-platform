// App Routing Module
// Configures application routes with authentication guards

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { PurchaseRequestsComponent } from './components/purchase-requests/purchase-requests.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { AuthGuard } from './guards/auth.guard';
import { PublicArticlesComponent } from './components/articles/public-articles/public-articles.component';
import { ArticlesListComponent } from './components/articles/articles-list/articles-list.component';
import { ArticleDetailComponent } from './components/articles/article-detail/article-detail.component';

const routes: Routes = [
  // Default route - Public Home Page
  { path: '', component: HomeComponent },
  
  // Public routes
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'welcome', component: WelcomeComponent },
  
  // Day 6: Public Articles (no authentication required)
  { path: 'articles', component: PublicArticlesComponent },
  { path: 'articles/:id', component: ArticleDetailComponent },
  
  // Authentication routes - public access
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Protected routes - Internal workspace
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  
  // Day 2 Business Domain Routes
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'purchase-requests', component: PurchaseRequestsComponent, canActivate: [AuthGuard] },
  
  // Day 3 Admin Routes
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard] },
  
  // Day 6: Articles Management (authenticated)
  { path: 'dashboard/articles', component: ArticlesListComponent, canActivate: [AuthGuard] },
  
  // Wildcard route - 404 not found (redirect to home)
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
