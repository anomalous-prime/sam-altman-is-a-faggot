import {
  Cluster,
  Area,
  Tag,
  TaxonomyStats,
  ApiResponse,
  AreasListResponse,
  TagsListResponse,
  CreateClusterRequest,
  UpdateClusterRequest,
  MoveClusterRequest,
  CreateAreaRequest,
  UpdateAreaRequest,
  CreateTagRequest,
  UpdateTagRequest,
  BulkTagRequest,
  TaxonomyFilters,
} from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
const API_BASE = `${BASE_URL}/api/v1`;

class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Cluster operations
  async getClusters(filters?: TaxonomyFilters): Promise<ApiResponse<Cluster[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.include_inactive) params.append('include_inactive', filters.include_inactive.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/clusters?${queryString}` : '/clusters';
    
    return this.request<Cluster[]>(endpoint);
  }

  async getCluster(uid: string): Promise<ApiResponse<Cluster>> {
    return this.request<Cluster>(`/clusters/${uid}`);
  }

  async createCluster(data: CreateClusterRequest): Promise<ApiResponse<Cluster>> {
    return this.request<Cluster>('/clusters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCluster(uid: string, data: UpdateClusterRequest): Promise<ApiResponse<Cluster>> {
    return this.request<Cluster>(`/clusters/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async moveCluster(uid: string, data: MoveClusterRequest): Promise<ApiResponse<Cluster>> {
    return this.request<Cluster>(`/clusters/${uid}/move`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCluster(uid: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/clusters/${uid}`, {
      method: 'DELETE',
    });
  }

  async activateCluster(uid: string): Promise<ApiResponse<Cluster>> {
    return this.request<Cluster>(`/clusters/${uid}/activate`, {
      method: 'PATCH',
    });
  }

  async deactivateCluster(uid: string): Promise<ApiResponse<Cluster>> {
    return this.request<Cluster>(`/clusters/${uid}/deactivate`, {
      method: 'PATCH',
    });
  }

  // Area operations
  async getAreas(filters?: TaxonomyFilters): Promise<ApiResponse<AreasListResponse>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.cluster_uid) params.append('cluster_uid', filters.cluster_uid);
    if (filters?.tag_slug) params.append('tag_slug', filters.tag_slug);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.include_inactive) params.append('include_inactive', filters.include_inactive.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/areas?${queryString}` : '/areas';
    
    return this.request<AreasListResponse>(endpoint);
  }

  async getArea(uid: string): Promise<ApiResponse<Area>> {
    return this.request<Area>(`/areas/${uid}`);
  }

  async createArea(data: CreateAreaRequest): Promise<ApiResponse<Area>> {
    return this.request<Area>('/areas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArea(uid: string, data: UpdateAreaRequest): Promise<ApiResponse<Area>> {
    return this.request<Area>(`/areas/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteArea(uid: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/areas/${uid}`, {
      method: 'DELETE',
    });
  }

  async activateArea(uid: string): Promise<ApiResponse<Area>> {
    return this.request<Area>(`/areas/${uid}/activate`, {
      method: 'PATCH',
    });
  }

  async deactivateArea(uid: string): Promise<ApiResponse<Area>> {
    return this.request<Area>(`/areas/${uid}/deactivate`, {
      method: 'PATCH',
    });
  }

  // Tag operations
  async getTags(filters?: TaxonomyFilters): Promise<ApiResponse<TagsListResponse>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.include_inactive) params.append('include_inactive', filters.include_inactive.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/tags?${queryString}` : '/tags';
    
    return this.request<TagsListResponse>(endpoint);
  }

  async getTag(slug: string): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${slug}`);
  }

  async createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    return this.request<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTag(slug: string, data: UpdateTagRequest): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTag(slug: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tags/${slug}`, {
      method: 'DELETE',
    });
  }

  async activateTag(slug: string): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${slug}/activate`, {
      method: 'PATCH',
    });
  }

  async deactivateTag(slug: string): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${slug}/deactivate`, {
      method: 'PATCH',
    });
  }

  // Area-Tag operations
  async tagAreas(data: BulkTagRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/areas/tag', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async untagAreas(data: BulkTagRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/areas/untag', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Statistics
  async getStats(): Promise<ApiResponse<TaxonomyStats>> {
    return this.request<TaxonomyStats>('/stats');
  }

  // Health check
  async getHealth(): Promise<ApiResponse<{ status: string; database: string }>> {
    return this.request<{ status: string; database: string }>('/health');
  }
}

export const apiClient = new APIClient();