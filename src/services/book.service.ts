import { api } from 'boot/axios';
import { Book } from 'src/interfaces/Book';

export class BookService {
  static getBooks(): Promise<Book[]> {
    return api.get<Book[]>('/api/v1/books').then(response => response.data);
  }
}
