export enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

export enum NodeType {
  Root = 'root',
  Tree = 'tree',
  Cluster = 'cluster',
  Area = 'area',
}

export interface TreeNode {
  name: string;
  type: NodeType;
  id?: string;
  status?: Status;
  children?: TreeNode[];
  tags?: string[];
}

export interface Tree {
  id: string;
  name: string;
  status: Status;
  created_at: string;
  clusters: Cluster[];
}

export interface Cluster {
  uid: string;
  name: string;
  status: Status;
  parent_id: string | null;
  tree_id: string;
  children: string[];
  areas: string[];
}

export interface Area {
  uid: string;
  name: string;
  status: Status;
  cluster_uid: string;
  tags: string[];
}

export interface Tag {
  slug: string;
  name: string;
  status: Status;
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
