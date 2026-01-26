import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { LabInfo } from '../../models/lab-info.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  labInfo: LabInfo | null = null;
  loading = true;
  error = '';

  constructor(
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLabInfo();
  }

  loadLabInfo(): void {
    this.publicService.getLabInfo().subscribe({
      next: (data) => {
        this.labInfo = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des informations:', err);
        this.error = 'Impossible de charger les informations du laboratoire';
        this.loading = false;
      }
    });
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/welcome']);
  }
}
