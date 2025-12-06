import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookstoreService } from './services/bookstore.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="header-content">
          <h1>📚 Bookstore Management System</h1>
          <p class="subtitle">Lab 5 - Full Stack Application</p>
        </div>
        
        <nav class="nav">
          <a routerLink="/books" routerLinkActive="active" class="nav-link">
            📖 Books
          </a>
          <a routerLink="/authors" routerLinkActive="active" class="nav-link">
            ✍️ Authors
          </a>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <p>Angular 20 + Signals + Node.js + Express + SQLite</p>
        <p class="tech-stack">Using async/await with native fetch() • No RxJS • No Observables • No Promises</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
    }

    .header {
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }

    .header-content {
      text-align: center;
      margin-bottom: 20px;
    }

    h1 {
      margin: 0;
      color: #333;
      font-size: 32px;
      font-weight: 700;
    }

    .subtitle {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .nav {
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    .nav-link {
      padding: 12px 24px;
      background: #f3f4f6;
      color: #374151;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .nav-link:hover {
      background: #e5e7eb;
      transform: translateY(-2px);
    }

    .nav-link.active {
      background: #4f46e5;
      color: white;
    }

    .main-content {
      flex: 1;
      padding: 40px 20px;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }

    .footer {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      text-align: center;
      color: #666;
    }

    .footer p {
      margin: 5px 0;
      font-size: 14px;
    }

    .tech-stack {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class AppComponent {
  title = 'Bookstore App';
}