import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookstoreService } from '../../services/bookstore.service';

@Component({
  selector: 'app-authors-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="form-container">
      <h2>Add Author</h2>
      
      <form #authorForm="ngForm" (ngSubmit)="onSubmit(authorForm)">
        <div class="form-group">
          <label for="authorName">Author Name *</label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            [(ngModel)]="authorName"
            #nameField="ngModel"
            required
            class="form-control"
            [class.invalid]="nameField.invalid && nameField.touched"
            placeholder="Enter author name"
          />
          
          @if (nameField.invalid && nameField.touched) {
            <div class="error-message">Author name is required</div>
          }
          
          <div class="validation-states">
            <span [class.active]="nameField.pristine">Pristine</span>
            <span [class.active]="nameField.dirty">Dirty</span>
            <span [class.active]="nameField.untouched">Untouched</span>
            <span [class.active]="nameField.touched">Touched</span>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn-primary"
          [disabled]="authorForm.invalid || bookstoreService.authors().length >= 5"
        >
          @if (bookstoreService.authors().length >= 5) {
            Maximum Authors Reached (5)
          } @else {
            Add Author
          }
        </button>
        
        <div class="counter">
          {{ bookstoreService.authors().length }}/5 authors added
        </div>
      </form>

      <div class="authors-list">
        <h3>Authors List</h3>
        @if (bookstoreService.authors().length === 0) {
          <p class="no-data">No authors added yet</p>
        } @else {
          @for (author of bookstoreService.authors(); track author.author_id) {
            <div class="author-card">
              <div class="author-info">
                <h4>{{ author.name }}</h4>
                <p>Books: {{ getBookCount(author.author_id) }}</p>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #4f46e5;
    }

    .form-control.invalid {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 12px;
      margin-top: 5px;
    }

    .validation-states {
      display: flex;
      gap: 10px;
      margin-top: 8px;
      font-size: 11px;
    }

    .validation-states span {
      padding: 2px 8px;
      background: #f3f4f6;
      border-radius: 4px;
      color: #9ca3af;
    }

    .validation-states span.active {
      background: #4f46e5;
      color: white;
    }

    .btn-primary {
      width: 100%;
      padding: 12px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4338ca;
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .counter {
      text-align: center;
      margin-top: 10px;
      color: #6b7280;
      font-size: 12px;
    }

    .authors-list {
      margin-top: 40px;
    }

    h3 {
      color: #333;
      margin-bottom: 15px;
    }

    .no-data {
      text-align: center;
      color: #9ca3af;
      padding: 40px;
    }

    .author-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      color: white;
    }

    .author-info h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
    }

    .author-info p {
      margin: 0;
      font-size: 13px;
      opacity: 0.9;
    }
  `]
})
export class AuthorsFormComponent {
  authorName: string = '';

  constructor(public bookstoreService: BookstoreService) {}

  async onSubmit(form: any) {
    if (form.valid && this.bookstoreService.authors().length < 5) {
      await this.bookstoreService.addAuthor(this.authorName);
      this.authorName = '';
      form.resetForm();
    }
  }

  getBookCount(authorId: number): number {
    return this.bookstoreService.books().filter(b => b.author_id === authorId).length;
  }
}