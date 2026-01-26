import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  username = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier l'état de connexion au chargement
    this.updateLoginStatus();

    // Mettre à jour l'état lors de la navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLoginStatus();
    });
  }

  updateLoginStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.username = user?.firstName + ' ' + user?.lastName || '';
    } else {
      this.username = '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = '';
    this.router.navigate(['/home']);
  }
}
