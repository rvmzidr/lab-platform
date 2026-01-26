import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { AuthService } from '../../services/auth.service';
import { LabInfo, Team } from '../../models/lab-info.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  labInfo: LabInfo | null = null;
  teams: Team[] = [];
  loading = true;
  error = '';

  constructor(
    private publicService: PublicService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Charger les infos du labo et les équipes en parallèle
    Promise.all([
      this.publicService.getLabInfo().toPromise(),
      this.publicService.getTeams().toPromise()
    ]).then(([labInfo, teams]) => {
      this.labInfo = labInfo || null;
      this.teams = teams || [];
      this.loading = false;
    }).catch(err => {
      console.error('Erreur lors du chargement:', err);
      this.error = 'Impossible de charger les informations';
      this.loading = false;
    });
  }

  goBack(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
