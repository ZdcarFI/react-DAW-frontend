import { Product, SaveProduct, Page } from '../types/product';
import { apiService } from './api';

class ProductService {
  async getProducts(page = 0, size = 10): Promise<Page<Product>> {
    return apiService.get<Page<Product>>('/products', { p: page, limit: size });
  }

  async getProduct(id: number): Promise<Product> {
    return apiService.get<Product>(`/products/${id}`);
  }

  async createProduct(product: SaveProduct): Promise<Product> {
    return apiService.post<Product>('/products', product);
  }

  async updateProduct(id: number, product: SaveProduct): Promise<Product> {
    return apiService.put<Product>(`/products/${id}`, product);
  }

  async disableProduct(id: number): Promise<Product> {
    return apiService.put<Product>(`/products/${id}/disabled`);
  }
  async enableProduct(id: number): Promise<Product> {
    return apiService.put<Product>(`/products/${id}/enabled`);
  }
}

export const productService = new ProductService();