import React, { useState } from 'react';
import { AlertTriangle, Trash } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Base';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, userName }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-4">
        <div className="flex items-center justify-center p-4 bg-red-500/10 rounded-full w-16 h-16 mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <p className="text-center text-slate-300">
          Are you sure you want to delete <strong className="text-white">{userName}</strong>? 
          <br />This action cannot be undone.
        </p>

        <div className="flex justify-center space-x-3 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
            <Trash className="w-4 h-4 mr-2" /> Delete User
          </Button>
        </div>
      </div>
    </Modal>
  );
};