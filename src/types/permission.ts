export interface ShowPermission {
  id: number;
  operation: string;
  httpMethod: string;
  module: string;
  role: string;
}

export interface SavePermission {
  role: string;
  operation: string;
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