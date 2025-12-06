import { Routes } from '@angular/router';
import { AuthorsFormComponent } from './components/authors-form/authors-form.component';
import { BooksFormComponent } from './components/books-form/books-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BooksFormComponent },
  { path: 'authors', component: AuthorsFormComponent }
];
