// Root Component
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <div class="main-wrapper">
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
    }
    .main-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      transition: all 0.3s ease;
    }
    .main-content {
      flex: 1;
      padding: 20px;
      padding-top: 80px;
      background: #f5f5f5;
    }
    @media (max-width: 768px) {
      .main-content {
        padding-top: 100px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Lab Platform';
}
