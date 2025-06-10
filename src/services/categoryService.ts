import { Category, SaveCategory, Page } from '../types/product';
import { apiService } from './api';

class CategoryService {
  async getCategories(page = 0, size = 10): Promise<Page<Category>> {
    return apiService.get<Page<Category>>('/categories', { p: page, limit: size });
  }

  async getCategory(id: number): Promise<Category> {
    return apiService.get<Category>(`/categories/${id}`);
  }

  async createCategory(category: SaveCategory): Promise<Category> {
    return apiService.post<Category>('/categories', category);
  }

  async updateCategory(id: number, category: SaveCategory): Promise<Category> {
    return apiService.put<Category>(`/categories/${id}`, category);
  }

  async disableCategory(id: number): Promise<Category> {
    return apiService.put<Category>(`/categories/${id}/disabled`);
  }
  async enableCategory(id: number): Promise<Category> {
    return apiService.put<Category>(`/categories/${id}/enabled`);
  }
}

export const categoryService = new CategoryService();