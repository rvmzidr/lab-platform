import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitted = false;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.isFormValid()) {
      this.loading = true;
      
      // Simulation d'envoi
      setTimeout(() => {
        this.loading = false;
        this.submitted = true;
        this.resetForm();
        
        // Réinitialiser le message après 5 secondes
        setTimeout(() => {
          this.submitted = false;
        }, 5000);
      }, 1500);
    }
  }

  isFormValid(): boolean {
    return !!(this.contactForm.name && 
              this.contactForm.email && 
              this.contactForm.subject && 
              this.contactForm.message);
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  goBack(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
