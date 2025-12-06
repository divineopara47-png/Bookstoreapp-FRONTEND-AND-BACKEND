import { Injectable, signal } from '@angular/core';
import { Author } from '../models/author.model';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookstoreService {
  private API_URL = 'http://localhost:3000/api';
  
  // Signals for reactive state management
  authors = signal<Author[]>([]);
  books = signal<Book[]>([]);

  constructor() {
    this.loadAuthors();
    this.loadBooks();
  }

  // ========== AUTHORS ==========
  
  async loadAuthors(): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/authors`);
      const data = await response.json();
      this.authors.set(data);
    } catch (error) {
      console.error('Error loading authors:', error);
    }
  }

  async addAuthor(name: string): Promise<Author | null> {
    try {
      const response = await fetch(`${this.API_URL}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const newAuthor = await response.json();
      this.authors.update(authors => [...authors, newAuthor]);
      return newAuthor;
    } catch (error) {
      console.error('Error adding author:', error);
      return null;
    }
  }

  // ========== BOOKS ==========
  
  async loadBooks(): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/books`);
      const data = await response.json();
      this.books.set(data);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }

  async addBook(title: string, author_id: number): Promise<Book | null> {
    try {
      const response = await fetch(`${this.API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author_id })
      });
      const newBook = await response.json();
      this.books.update(books => [...books, newBook]);
      return newBook;
    } catch (error) {
      console.error('Error adding book:', error);
      return null;
    }
  }

  async updateBook(book_id: number, title: string, author_id: number): Promise<Book | null> {
    try {
      const response = await fetch(`${this.API_URL}/books/${book_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author_id })
      });
      const updatedBook = await response.json();
      this.books.update(books => 
        books.map(book => book.book_id === book_id ? updatedBook : book)
      );
      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      return null;
    }
  }

  async deleteBook(book_id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/books/${book_id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        this.books.update(books => books.filter(book => book.book_id !== book_id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  }

  // Helper method to get author name
  getAuthorName(author_id: number): string {
    const author = this.authors().find(a => a.author_id === author_id);
    return author ? author.name : 'Unknown';
  }
}