import React from 'react';
import { Ticket } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Base';

interface GuestClaimModalProps {
  isOpen: boolean;
  onClaim: () => void;
  onIgnore: () => void;
  ticketData: any;
}

export const GuestClaimModal: React.FC<GuestClaimModalProps> = ({ isOpen, onClaim, onIgnore, ticketData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onIgnore} title="Unclaimed Guest Ticket Found">
      <div className="space-y-4">
        <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex items-start space-x-4">
          <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
             <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">We found a ticket draft from your session</h4>
            <p className="text-sm text-slate-300 line-clamp-2">
              "{ticketData?.description || 'No description provided'}"
            </p>
            <div className="mt-2 text-xs text-slate-500">
               Created: {new Date(ticketData?.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-sm">
          Would you like to link this ticket to your account? If you ignore it, the draft will be discarded.
        </p>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" onClick={onIgnore}>Ignore & Discard</Button>
          <Button variant="primary" onClick={onClaim}>
             Claim Ticket
          </Button>
        </div>
      </div>
    </Modal>
  );
};