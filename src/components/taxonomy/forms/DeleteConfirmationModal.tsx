"use client";

import React from 'react';
import { Trash2, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Cluster, Area, Tag } from '@/types/api';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'cluster' | 'area' | 'tag';
  item: Cluster | Area | Tag;
  loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  item,
  loading = false
}) => {
  const getItemName = () => {
    if (type === 'tag') {
      return (item as Tag).display_name;
    }
    return (item as Cluster | Area).name;
  };

  const getWarningMessage = () => {
    switch (type) {
      case 'cluster':
        return 'Deleting this cluster will also affect any child clusters and areas.';
      case 'tag':
        return 'This tag may be in use by areas and will be removed from them.';
      case 'area':
        return 'This will permanently remove the area and its associations.';
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${type}`}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-slate-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-white">
            &quot;{getItemName()}&quot;
          </span>
          ? This action cannot be undone.
        </p>
        
        {getWarningMessage() && (
          <div className="bg-yellow-500/20 text-yellow-300 p-3 rounded-lg text-sm">
            <strong>Warning:</strong> {getWarningMessage()}
          </div>
        )}
        
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={onConfirm}
            variant="danger"
            loading={loading}
            disabled={loading}
            icon={<Trash2 className="w-4 h-4" />}
            className="flex-1"
          >
            Delete {type}
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={loading}
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;