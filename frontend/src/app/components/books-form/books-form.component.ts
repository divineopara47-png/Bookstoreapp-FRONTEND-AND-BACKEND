import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookstoreService } from '../../services/bookstore.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-books-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="form-container">
      <h2>{{ editingBook ? 'Edit Book' : 'Add Book' }}</h2>
      
      <form #bookForm="ngForm" (ngSubmit)="onSubmit(bookForm)">
        <div class="form-group">
          <label for="bookTitle">Book Title *</label>
          <input
            type="text"
            id="bookTitle"
            name="bookTitle"
            [(ngModel)]="bookTitle"
            #titleField="ngModel"
            required
            class="form-control"
            [class.invalid]="titleField.invalid && titleField.touched"
            placeholder="Enter book title"
          />
          
          @if (titleField.invalid && titleField.touched) {
            <div class="error-message">Book title is required</div>
          }
          
          <div class="validation-states">
            <span [class.active]="titleField.pristine">Pristine</span>
            <span [class.active]="titleField.dirty">Dirty</span>
            <span [class.active]="titleField.untouched">Untouched</span>
            <span [class.active]="titleField.touched">Touched</span>
          </div>
        </div>

        <div class="form-group">
          <label for="authorId">Author *</label>
          <select
            id="authorId"
            name="authorId"
            [(ngModel)]="authorId"
            #authorField="ngModel"
            required
            class="form-control"
            [class.invalid]="authorField.invalid && authorField.touched"
          >
            <option value="">Select an author</option>
            @for (author of bookstoreService.authors(); track author.author_id) {
              <option [value]="author.author_id">{{ author.name }}</option>
            }
          </select>
          
          @if (authorField.invalid && authorField.touched) {
            <div class="error-message">Please select an author</div>
          }
          
          <div class="validation-states">
            <span [class.active]="authorField.pristine">Pristine</span>
            <span [class.active]="authorField.dirty">Dirty</span>
            <span [class.active]="authorField.untouched">Untouched</span>
            <span [class.active]="authorField.touched">Touched</span>
          </div>
        </div>

        <div class="button-group">
          <button 
            type="submit" 
            class="btn-primary"
            [disabled]="bookForm.invalid || (!editingBook && bookstoreService.books().length >= 5)"
          >
            @if (editingBook) {
              Update Book
            } @else if (bookstoreService.books().length >= 5) {
              Maximum Books Reached (5)
            } @else {
              Add Book
            }
          </button>
          
          @if (editingBook) {
            <button type="button" class="btn-secondary" (click)="cancelEdit()">
              Cancel
            </button>
          }
        </div>
        
        @if (!editingBook) {
          <div class="counter">
            {{ bookstoreService.books().length }}/5 books added
          </div>
        }
      </form>

      <!-- Search -->
      <div class="search-section">
        <h3>Search Books</h3>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          class="form-control"
          placeholder="Search by title or author name..."
        />
        
        @if (searchTerm && getSearchResults().length > 0) {
          <div class="search-results">
            @for (book of getSearchResults(); track book.book_id) {
              <div class="search-result-card">
                <h4>{{ book.title }}</h4>
                <p>by {{ bookstoreService.getAuthorName(book.author_id) }}</p>
              </div>
            }
          </div>
        }
        
        @if (searchTerm && getSearchResults().length === 0) {
          <p class="no-data">No books found</p>
        }
      </div>

      <!-- Books List -->
      <div class="books-list">
        <h3>Books List</h3>
        @if (bookstoreService.books().length === 0) {
          <p class="no-data">No books added yet</p>
        } @else {
          @for (book of bookstoreService.books(); track book.book_id) {
            <div class="book-card">
              <div class="book-info">
                <h4>{{ book.title }}</h4>
                <p>by {{ bookstoreService.getAuthorName(book.author_id) }}</p>
              </div>
              <div class="book-actions">
                <button class="btn-icon btn-edit" (click)="editBook(book)" title="Edit">
                  ✏️
                </button>
                <button class="btn-icon btn-delete" (click)="deleteBook(book.book_id)" title="Delete">
                  🗑️
                </button>
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

    h2, h3 {
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

    select.form-control {
      cursor: pointer;
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

    .button-group {
      display: flex;
      gap: 10px;
    }

    .btn-primary {
      flex: 1;
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

    .btn-secondary {
      padding: 12px 20px;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .counter {
      text-align: center;
      margin-top: 10px;
      color: #6b7280;
      font-size: 12px;
    }

    .search-section {
      margin-top: 40px;
      padding-top: 40px;
      border-top: 2px solid #e5e7eb;
    }

    .search-results {
      margin-top: 20px;
    }

    .search-result-card {
      background: #dbeafe;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .search-result-card h4 {
      margin: 0 0 5px 0;
      color: #1e40af;
    }

    .search-result-card p {
      margin: 0;
      color: #3b82f6;
      font-size: 13px;
    }

    .books-list {
      margin-top: 40px;
    }

    .no-data {
      text-align: center;
      color: #9ca3af;
      padding: 40px;
    }

    .book-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .book-info h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
    }

    .book-info p {
      margin: 0;
      font-size: 13px;
      opacity: 0.9;
    }

    .book-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: transform 0.2s;
    }

    .btn-icon:hover {
      transform: scale(1.1);
    }

    .btn-edit {
      background: #3b82f6;
    }

    .btn-delete {
      background: #ef4444;
    }
  `]
})
export class BooksFormComponent {
  bookTitle: string = '';
  authorId: string = '';
  searchTerm: string = '';
  editingBook: Book | null = null;

  constructor(public bookstoreService: BookstoreService) {}

  async onSubmit(form: any) {
    if (form.valid) {
      if (this.editingBook) {
        await this.bookstoreService.updateBook(
          this.editingBook.book_id,
          this.bookTitle,
          Number(this.authorId)
        );
        this.editingBook = null;
      } else {
        if (this.bookstoreService.books().length < 5) {
          await this.bookstoreService.addBook(this.bookTitle, Number(this.authorId));
        }
      }
      this.bookTitle = '';
      this.authorId = '';
      form.resetForm();
    }
  }

  editBook(book: Book) {
    this.editingBook = book;
    this.bookTitle = book.title;
    this.authorId = book.author_id.toString();
  }

  async deleteBook(bookId: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      await this.bookstoreService.deleteBook(bookId);
    }
  }

  cancelEdit() {
    this.editingBook = null;
    this.bookTitle = '';
    this.authorId = '';
  }

  getSearchResults(): Book[] {
    if (!this.searchTerm) return [];
    
    const term = this.searchTerm.toLowerCase();
    const books = this.bookstoreService.books();
    const authors = this.bookstoreService.authors();
    
    // Search by book title
    const booksByTitle = books.filter(b => 
      b.title.toLowerCase().includes(term)
    );
    
    // Search by author name
    const matchedAuthors = authors.filter(a => 
      a.name.toLowerCase().includes(term)
    );
    const booksByAuthor = books.filter(b => 
      matchedAuthors.some(a => a.author_id === b.author_id)
    );
    
    // Combine and remove duplicates
    return [...new Set([...booksByTitle, ...booksByAuthor])];
  }
}