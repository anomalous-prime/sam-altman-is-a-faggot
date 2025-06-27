// === TAXONOMY SERVICE TYPES ===
export interface Cluster {
  uid: string;
  name: string;
  description?: string;
  parent_uid?: string;
  path: string;
  depth: number;
  sort_order: number;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
  children?: Cluster[];
  areas?: Area[];
  area_count?: number;
}

export interface Area {
  uid: string;
  name: string;
  description?: string;
  cluster_uid: string;
  cluster_path?: string;
  sort_order: number;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
  cluster?: Cluster;
  tags?: Tag[];
  tag_slugs?: string[];
  tag_count?: number;
}

export interface Tag {
  slug: string;
  display_name: string;
  color?: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
  areas?: Area[];
  usage_count?: number;
  area_count?: number;
}

export interface ClusterClosure {
  ancestor_uid: string;
  descendant_uid: string;
  depth: number;
}

export interface AreaTag {
  area_uid: string;
  tag_slug: string;
  created_at: string;
}

// === STORAGE SERVICE TYPES ===
export interface StorageFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mime_type: string;
  checksum: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
  metadata?: FileMetadata;
  versions?: FileVersion[];
  tags?: string[];
}

export interface FileMetadata {
  id: string;
  file_id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface FileVersion {
  id: string;
  file_id: string;
  version: number;
  path: string;
  size: number;
  checksum: string;
  created_at: string;
  is_current: boolean;
}

// === SEMANTIC SERVICE TYPES ===
export interface Embedding {
  id: string;
  content_id: string;
  content_type: 'file' | 'area' | 'cluster' | 'tag';
  vector: number[];
  model: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface SemanticSearch {
  query: string;
  content_type?: string;
  limit?: number;
  threshold?: number;
}

export interface SemanticResult {
  content_id: string;
  content_type: string;
  score: number;
  content: any;
  embedding?: Embedding;
}

// === NLQ SERVICE TYPES ===
export interface NLQQuery {
  id: string;
  query: string;
  user_id?: string;
  session_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  response?: NLQResponse;
}

export interface NLQResponse {
  id: string;
  query_id: string;
  response: string;
  sql_query?: string;
  results?: any[];
  confidence: number;
  processing_time: number;
  created_at: string;
}

// === PECGW SERVICE TYPES ===
export interface Capability {
  id: string;
  name: string;
  description?: string;
  resource_type: string;
  actions: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  user_id: string;
  capability_id: string;
  granted_at: string;
  expires_at?: string;
  granted_by: string;
  status: 'active' | 'revoked' | 'expired';
}

// === API RESPONSE TYPES ===
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  request_id?: string;
  pagination?: PaginationMetadata;
  meta?: ResponseMetadata;
}

export interface PaginationMetadata {
  page?: number;
  page_size?: number;
  total_pages?: number;
  total_count?: number;
  has_next?: boolean;
  has_previous?: boolean;
  total: number;
  limit: number;
  offset: number;
}

export interface AreasListResponse {
  areas: Area[];
  pagination: PaginationMetadata;
}

export interface TagsListResponse {
  tags: Tag[];
  pagination: PaginationMetadata;
}

export interface ResponseMetadata {
  timestamp: string;
  version: string;
  request_id: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  request_id?: string;
}

// === FILTER & SEARCH TYPES ===
export interface TaxonomyFilters {
  status?: string;
  cluster_uid?: string;
  tag_slug?: string;
  search?: string;
  include_inactive?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface StorageFilters {
  mime_type?: string;
  status?: string;
  search?: string;
  min_size?: number;
  max_size?: number;
  created_after?: string;
  created_before?: string;
  has_metadata?: boolean;
  page?: number;
  page_size?: number;
}

// === DASHBOARD & STATS TYPES ===
export interface TaxonomyStats {
  totalClusters: number;
  totalAreas: number;
  totalTags: number;
  activeAreas: number;
  maxDepth: number;
  recentActivity: number;
  tagUsage: TagUsageStats[];
  clusterDistribution: ClusterDistribution[];
}

export interface TagUsageStats {
  slug: string;
  name: string;
  count: number;
  percentage: number;
}

export interface ClusterDistribution {
  depth: number;
  count: number;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  fileTypes: FileTypeStats[];
  sizeDistribution: SizeDistribution[];
  recentUploads: number;
  storageUsage: number;
}

export interface FileTypeStats {
  mime_type: string;
  count: number;
  total_size: number;
}

export interface SizeDistribution {
  range: string;
  count: number;
  size: number;
}

export interface SemanticStats {
  totalEmbeddings: number;
  modelDistribution: ModelStats[];
  processingQueue: number;
  averageProcessingTime: number;
  recentQueries: number;
}

export interface ModelStats {
  model: string;
  count: number;
  average_score: number;
}

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: 'up' | 'down';
  timestamp: string;
  version?: string;
  uptime?: number;
}

export interface ServiceStats {
  totalClusters: number;
  totalAreas: number;
  totalTags: number;
  totalFiles: number;
  totalEmbeddings: number;
  totalQueries: number;
  activeCapabilities: number;
  systemHealth: 'excellent' | 'good' | 'degraded' | 'critical' | 'unknown';
}

// === CREATE/UPDATE REQUEST TYPES ===
export interface CreateClusterRequest {
  uid: string;
  name: string;
  description?: string;
  parent_uid?: string;
  sort_order?: number;
}

export interface UpdateClusterRequest {
  name?: string;
  description?: string;
  sort_order?: number;
}

export interface MoveClusterRequest {
  new_parent_uid?: string;
}

export interface CreateAreaRequest {
  uid: string;
  name: string;
  description?: string;
  cluster_uid: string;
  sort_order?: number;
}

export interface UpdateAreaRequest {
  name?: string;
  description?: string;
  sort_order?: number;
}

export interface CreateTagRequest {
  slug: string;
  display_name: string;
  color?: string;
}

export interface UpdateTagRequest {
  display_name?: string;
  color?: string;
}

export interface BulkTagRequest {
  area_uids: string[];
  tag_slugs: string[];
}

export interface UploadFileRequest {
  file: File;
  path?: string;
  metadata?: Record<string, string>;
  tags?: string[];
}

// === BULK OPERATION TYPES ===
export interface BulkOperation {
  action: 'activate' | 'deactivate' | 'delete' | 'move' | 'tag' | 'untag';
  target_ids: string[];
  params?: Record<string, any>;
}

export interface BulkOperationResult {
  success_count: number;
  failure_count: number;
  errors: BulkOperationError[];
}

export interface BulkOperationError {
  target_id: string;
  error: string;
}

// === EVENT TYPES ===
export interface TaxonomyEvent {
  id: string;
  type: string;
  version: string;
  timestamp: string;
  data: any;
  metadata: EventMetadata;
}

export interface EventMetadata {
  correlation_id: string;
  user_id?: string;
  source: string;
}