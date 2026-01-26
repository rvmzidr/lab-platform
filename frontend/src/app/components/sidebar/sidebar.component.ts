import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isLoggedIn = false;
  username = '';
  isAdmin = false;
  isMenuOpen = false; // Menu fermé par défaut

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check initial login status
    this.updateLoginStatus();
    
    // Update on navigation changes (after login/logout)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateLoginStatus();
      });
  }

  updateLoginStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.username = user ? `${user.firstName} ${user.lastName}` : '';
      this.isAdmin = user?.role === 'admin';
    } else {
      this.username = '';
      this.isAdmin = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
