import { ShowPermission, SavePermission, Page } from '../types/permission';
import { apiService } from './api';

class PermissionService {
  async getPermissions(page = 0, size = 10): Promise<Page<ShowPermission>> {
    return apiService.get<Page<ShowPermission>>('/permissions', { p: page, limit: size });
  }

  async getPermission(id: number): Promise<ShowPermission> {
    return apiService.get<ShowPermission>(`/permissions/${id}`);
  }

  async createPermission(permission: SavePermission): Promise<ShowPermission> {
    return apiService.post<ShowPermission>('/permissions', permission);
  }

  async deletePermission(id: number): Promise<ShowPermission> {
    return apiService.delete<ShowPermission>(`/permissions/${id}`);
  }
}

export const permissionService = new PermissionService();