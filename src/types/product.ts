export interface Product {
  id: number;
  name: string;
  price: number;
  status: ProductStatus;
  category: Category;
}

export interface SaveProduct {
  name: string;
  price: number;
  categoryId: number;
}

export enum ProductStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

export interface Category {
  id: number;
  name: string;
  status: CategoryStatus;
}

export interface SaveCategory {
  name: string;
}

export enum CategoryStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}