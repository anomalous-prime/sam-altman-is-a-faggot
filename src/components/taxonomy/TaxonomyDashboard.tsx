"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Home, TreePine, Grid, Tags, BarChart3 } from 'lucide-react';
import { useTaxonomyData } from '@/hooks/useTaxonomyData';
import { useTaxonomyOperations } from '@/hooks/useTaxonomyOperations';
import { useNotifications } from '@/hooks/useNotifications';

// View Components
import OverviewView from './views/OverviewView';
import ClustersView from './views/ClustersView';
import AreasView from './views/AreasView';
import TagsView from './views/TagsView';
import TreeGraphView from './views/TreeGraphView';

// Form Components
import ClusterForm from './forms/ClusterForm';
import AreaForm from './forms/AreaForm';
import TagForm from './forms/TagForm';
import DeleteConfirmationModal from './forms/DeleteConfirmationModal';

// UI Components
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';

import { 
  Cluster, 
  Area, 
  Tag, 
  CreateClusterRequest, 
  UpdateClusterRequest, 
  CreateAreaRequest, 
  UpdateAreaRequest, 
  CreateTagRequest, 
  UpdateTagRequest 
} from '@/types/api';

type TabType = 'overview' | 'clusters' | 'areas' | 'tags' | 'graph';

interface ModalState {
  type: 'create' | 'edit' | 'delete' | null;
  entity: 'cluster' | 'area' | 'tag' | null;
  data?: Cluster | Area | Tag;
  parentCluster?: Cluster;
}

const TaxonomyDashboard: React.FC = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [modalState, setModalState] = useState<ModalState>({ type: null, entity: null });

  // Set tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['overview', 'clusters', 'areas', 'tags', 'graph'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const { clusters, areas, tags, loading, error, refreshData } = useTaxonomyData();
  const { 
    createCluster, 
    updateCluster, 
    deleteCluster, 
    toggleClusterStatus,
    createArea,
    updateArea,
    deleteArea,
    createTag,
    updateTag,
    deleteTag,
    toggleTagStatus,
    isLoading 
  } = useTaxonomyOperations();
  const { notifications, addNotification, removeNotification } = useNotifications();

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Home },
    { id: 'clusters' as const, label: 'Clusters', icon: TreePine },
    { id: 'areas' as const, label: 'Areas', icon: Grid },
    { id: 'tags' as const, label: 'Tags', icon: Tags },
    { id: 'graph' as const, label: 'Graph', icon: BarChart3 }
  ];

  const closeModal = () => {
    setModalState({ type: null, entity: null });
  };

  const handleSuccess = (message: string) => {
    addNotification({ type: 'success', message });
    refreshData();
    closeModal();
  };

  const handleError = (message: string) => {
    addNotification({ type: 'error', message });
  };

  // Cluster handlers
  const handleCreateCluster = (parentCluster?: Cluster) => {
    setModalState({ type: 'create', entity: 'cluster', parentCluster });
  };

  const handleEditCluster = (cluster: Cluster) => {
    setModalState({ type: 'edit', entity: 'cluster', data: cluster });
  };

  const handleDeleteCluster = (cluster: Cluster) => {
    setModalState({ type: 'delete', entity: 'cluster', data: cluster });
  };

  const handleToggleClusterStatus = async (cluster: Cluster) => {
    try {
      await toggleClusterStatus(cluster.uid);
      handleSuccess(`Cluster ${cluster.status === 'active' ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to toggle cluster status');
    }
  };

  // Area handlers
  const handleCreateArea = () => {
    setModalState({ type: 'create', entity: 'area' });
  };

  const handleEditArea = (area: Area) => {
    setModalState({ type: 'edit', entity: 'area', data: area });
  };

  const handleDeleteArea = (area: Area) => {
    setModalState({ type: 'delete', entity: 'area', data: area });
  };

  // Tag handlers
  const handleCreateTag = () => {
    setModalState({ type: 'create', entity: 'tag' });
  };

  const handleEditTag = (tag: Tag) => {
    setModalState({ type: 'edit', entity: 'tag', data: tag });
  };

  const handleDeleteTag = (tag: Tag) => {
    setModalState({ type: 'delete', entity: 'tag', data: tag });
  };

  const handleToggleTagStatus = async (tag: Tag) => {
    try {
      await toggleTagStatus(tag.slug);
      handleSuccess(`Tag ${tag.status === 'active' ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to toggle tag status');
    }
  };

  // Form submission handlers
  const handleClusterSubmit = async (formData: CreateClusterRequest | UpdateClusterRequest) => {
    try {
      if (modalState.type === 'create') {
        await createCluster(formData);
        handleSuccess('Cluster created successfully');
      } else if (modalState.type === 'edit' && modalState.data) {
        await updateCluster((modalState.data as Cluster).uid, formData);
        handleSuccess('Cluster updated successfully');
      }
    } catch (err) {
      throw err; // Let the form handle the error display
    }
  };

  const handleAreaSubmit = async (formData: CreateAreaRequest | UpdateAreaRequest) => {
    try {
      if (modalState.type === 'create') {
        await createArea(formData);
        handleSuccess('Area created successfully');
      } else if (modalState.type === 'edit' && modalState.data) {
        await updateArea((modalState.data as Area).uid, formData);
        handleSuccess('Area updated successfully');
      }
    } catch (err) {
      throw err; // Let the form handle the error display
    }
  };

  const handleTagSubmit = async (formData: CreateTagRequest | UpdateTagRequest) => {
    try {
      if (modalState.type === 'create') {
        await createTag(formData);
        handleSuccess('Tag created successfully');
      } else if (modalState.type === 'edit' && modalState.data) {
        await updateTag((modalState.data as Tag).slug, formData);
        handleSuccess('Tag updated successfully');
      }
    } catch (err) {
      throw err; // Let the form handle the error display
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modalState.data) return;

    try {
      switch (modalState.entity) {
        case 'cluster':
          await deleteCluster((modalState.data as Cluster).uid);
          handleSuccess('Cluster deleted successfully');
          break;
        case 'area':
          await deleteArea((modalState.data as Area).uid);
          handleSuccess('Area deleted successfully');
          break;
        case 'tag':
          await deleteTag((modalState.data as Tag).slug);
          handleSuccess('Tag deleted successfully');
          break;
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={() => refreshData()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView
            clustersCount={clusters?.length || 0}
            areasCount={areas?.length || 0}
            tagsCount={tags?.length || 0}
            tags={tags || []}
          />
        );
      case 'clusters':
        return (
          <ClustersView
            clusters={clusters || []}
            onCreateCluster={handleCreateCluster}
            onEditCluster={handleEditCluster}
            onDeleteCluster={handleDeleteCluster}
            onToggleStatus={handleToggleClusterStatus}
          />
        );
      case 'areas':
        return (
          <AreasView
            areas={areas || []}
            clusters={clusters || []}
            onCreateArea={handleCreateArea}
            onEditArea={handleEditArea}
            onDeleteArea={handleDeleteArea}
          />
        );
      case 'tags':
        return (
          <TagsView
            tags={tags || []}
            onCreateTag={handleCreateTag}
            onEditTag={handleEditTag}
            onDeleteTag={handleDeleteTag}
            onToggleStatus={handleToggleTagStatus}
          />
        );
      case 'graph':
        return <TreeGraphView clusters={clusters || []} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {renderTabContent()}

      {/* Modals */}
      {modalState.type === 'create' && modalState.entity === 'cluster' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalState.parentCluster ? 'Create Child Cluster' : 'Create Cluster'}
          size="lg"
        >
          <ClusterForm
            parentCluster={modalState.parentCluster}
            onSubmit={handleClusterSubmit}
            onCancel={closeModal}
            isSubmitting={isLoading}
          />
        </Modal>
      )}

      {modalState.type === 'edit' && modalState.entity === 'cluster' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Edit Cluster"
          size="lg"
        >
          <ClusterForm
            cluster={modalState.data as Cluster}
            onSubmit={handleClusterSubmit}
            onCancel={closeModal}
            isSubmitting={isLoading}
          />
        </Modal>
      )}

      {modalState.type === 'create' && modalState.entity === 'area' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Create Area"
          size="lg"
        >
          <AreaForm
            clusters={clusters}
            onSubmit={handleAreaSubmit}
            onCancel={closeModal}
            isSubmitting={isLoading}
          />
        </Modal>
      )}

      {modalState.type === 'edit' && modalState.entity === 'area' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Edit Area"
          size="lg"
        >
          <AreaForm
            area={modalState.data as Area}
            clusters={clusters}
            onSubmit={handleAreaSubmit}
            onCancel={closeModal}
            isSubmitting={isLoading}
          />
        </Modal>
      )}

      {modalState.type === 'create' && modalState.entity === 'tag' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Create Tag"
          size="md"
        >
          <TagForm
            onSubmit={handleTagSubmit}
            onCancel={closeModal}
            isSubmitting={isLoading}
          />
        </Modal>
      )}

      {modalState.type === 'edit' && modalState.entity === 'tag' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Edit Tag"
          size="md"
        >
          <TagForm
            tag={modalState.data as Tag}
            onSubmit={handleTagSubmit}
            onCancel={closeModal}
            isSubmitting={isLoading}
          />
        </Modal>
      )}

      {modalState.type === 'delete' && modalState.data && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
          type={modalState.entity!}
          item={modalState.data}
          loading={isLoading}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaxonomyDashboard;