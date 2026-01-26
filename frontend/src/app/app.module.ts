// App Module
// Main application module with all imports and declarations

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { PurchaseRequestsComponent } from './components/purchase-requests/purchase-requests.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PublicArticlesComponent } from './components/articles/public-articles/public-articles.component';
import { ArticlesListComponent } from './components/articles/articles-list/articles-list.component';
import { ArticleDetailComponent } from './components/articles/article-detail/article-detail.component';

// Services
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { ProjectService } from './services/project.service';
import { InstitutionService } from './services/institution.service';
import { PurchaseRequestService } from './services/purchase-request.service';
import { AdminService } from './services/admin.service';
import { PublicService } from './services/public.service';
import { ArticleService } from './services/article.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProjectsComponent,
    PurchaseRequestsComponent,
    WelcomeComponent,
    RegisterComponent,
    AdminUsersComponent,
    HomeComponent,
    AboutComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    SidebarComponent,
    PublicArticlesComponent,
    ArticlesListComponent,
    ArticleDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,           // For template-driven forms (ngModel)
    HttpClientModule       // For HTTP requests to backend API
  ],
  providers: [
    AuthService,
    AuthGuard,
    ProjectService,
    InstitutionService,
    PublicService,
    PurchaseRequestService,
    AdminService,
    ArticleService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true           // Allow multiple interceptors
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
