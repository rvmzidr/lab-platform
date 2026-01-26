// Register Component - For Lab Members
// After registration, users need Lab Head approval before login

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  formData = {
    // 1. Identité
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    
    // 2. Contact
    email: '',
    phone: '',
    address: '',
    
    // 3. Informations professionnelles
    grade: '',
    institution: '',
    lastDegree: '',
    degreeDate: '',
    degreeInstitution: '',
    orcid: '',
    
    // 4. Informations doctorant
    isPhD: false,
    phdTopic: '',
    phdProgress: '',
    phdStartYear: '',
    phdUniversity: '',
    phdSupervisor: '',
    
    // 5. Compte & Rôle
    role: 'member',
    
    // 6. Mot de passe
    password: '',
    confirmPassword: '',
    
    // 7. Validation
    acceptTerms: false
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation des champs obligatoires
    if (!this.formData.firstName || !this.formData.lastName || 
        !this.formData.birthDate || !this.formData.birthPlace ||
        !this.formData.gender || !this.formData.email || 
        !this.formData.phone || !this.formData.grade ||
        !this.formData.institution || !this.formData.lastDegree ||
        !this.formData.degreeDate || !this.formData.degreeInstitution ||
        !this.formData.password || !this.formData.confirmPassword) {
      this.errorMessage = 'Tous les champs obligatoires (*) doivent être remplis!';
      return;
    }

    // Validation doctorant
    if (this.formData.isPhD) {
      if (!this.formData.phdTopic || !this.formData.phdProgress || 
          !this.formData.phdStartYear || !this.formData.phdUniversity || 
          !this.formData.phdSupervisor) {
        this.errorMessage = 'Veuillez remplir toutes les informations doctorant!';
        return;
      }
    }

    // Validation mot de passe
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas!';
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères!';
      return;
    }

    // Validation email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.formData.email)) {
      this.errorMessage = 'Format d\'email invalide!';
      return;
    }

    // Validation des conditions
    if (!this.formData.acceptTerms) {
      this.errorMessage = 'Vous devez accepter les conditions d\'utilisation!';
      return;
    }

    this.isLoading = true;

    const registerData = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      password: this.formData.password,
      role: this.formData.role,
      // Champs additionnels
      birthDate: this.formData.birthDate,
      birthPlace: this.formData.birthPlace,
      gender: this.formData.gender,
      phone: this.formData.phone,
      address: this.formData.address,
      grade: this.formData.grade,
      institution: this.formData.institution,
      lastDegree: this.formData.lastDegree,
      degreeDate: this.formData.degreeDate,
      degreeInstitution: this.formData.degreeInstitution,
      orcid: this.formData.orcid,
      isPhD: this.formData.isPhD,
      phdTopic: this.formData.phdTopic,
      phdProgress: this.formData.phdProgress,
      phdStartYear: this.formData.phdStartYear,
      phdUniversity: this.formData.phdUniversity,
      phdSupervisor: this.formData.phdSupervisor
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Inscription réussie! En attente d\'approbation. Vous serez redirigé vers la page de connexion...';
        
        // Redirection après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Échec de l\'inscription. Veuillez réessayer.';
      }
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
