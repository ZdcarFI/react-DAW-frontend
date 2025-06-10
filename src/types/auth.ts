export interface User {
  id: number;
  username: string;
  name: string;
  role: {
    id: number;
    name: string;
    permissions: Permission[];
  };
}

export interface Permission {
  id: number;
  operation: {
    id: number;
    name: string;
    path: string;
    httpMethod: string;
    module: {
      id: number;
      name: string;
      basePath: string;
    };
  };
}

export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  jwt: string;
}

export interface RegisteredUser {
  id: number;
  username: string;
  name: string;
  role: string;
  jwt: string;
}

export interface SaveUser {
  name: string;
  username: string;
  password: string;
  repeatedPassword: string;
}

// JWT Payload structure from backend
export interface JwtPayload {
  sub: string; // username
  name: string;
  role: string;
  authorities: Array<{
    authority: string;
  }>;
  iat: number;
  exp: number;
}

export enum RoleEnum {
  ADMINISTRATOR = 'ADMINISTRATOR',
  ASSISTANT_ADMINISTRATOR = 'ASSISTANT_ADMINISTRATOR',
  CUSTOMER = 'CUSTOMER'
}

export enum PermissionEnum {
  READ_ALL_PRODUCTS = 'READ_ALL_PRODUCTS',
  READ_ONE_PRODUCT = 'READ_ONE_PRODUCT',
  CREATE_ONE_PRODUCT = 'CREATE_ONE_PRODUCT',
  UPDATE_ONE_PRODUCT = 'UPDATE_ONE_PRODUCT',
  DISABLE_ONE_PRODUCT = 'DISABLE_ONE_PRODUCT',
  READ_ALL_CATEGORIES = 'READ_ALL_CATEGORIES',
  READ_ONE_CATEGORY = 'READ_ONE_CATEGORY',
  CREATE_ONE_CATEGORY = 'CREATE_ONE_CATEGORY',
  UPDATE_ONE_CATEGORY = 'UPDATE_ONE_CATEGORY',
  DISABLE_ONE_CATEGORY = 'DISABLE_ONE_CATEGORY',
  READ_MY_PROFILE = 'READ_MY_PROFILE'
}