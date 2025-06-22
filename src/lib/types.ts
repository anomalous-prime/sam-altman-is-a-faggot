export interface TreeNode {
  name: string;
  type: 'root' | 'tree' | 'cluster' | 'area';
  id?: string;
  status?: 'active' | 'inactive';
  children?: TreeNode[];
  tags?: string[];
}

export interface Tree {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
  clusters: Cluster[];
}

export interface Cluster {
  uid: string;
  name: string;
  status: 'active' | 'inactive';
  parent_id: string | null;
  tree_id: string;
  children: string[];
  areas: string[];
}

export interface Area {
  uid: string;
  name: string;
  status: 'active' | 'inactive';
  cluster_uid: string;
  tags: string[];
}

export interface Tag {
  slug: string;
  name: string;
  status: 'active' | 'inactive';
  tree_id: string;
}

export interface FilteredData {
  trees: Tree[];
  areas: Area[];
}

export interface Filters {
  tree: string;
  status: string;
  type: string;
  search: string;
} 