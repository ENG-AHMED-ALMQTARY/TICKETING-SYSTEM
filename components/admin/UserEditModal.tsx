import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Button } from '../ui/Base';
import { User, UserRole, UpdateUserPayload } from '../../types';
import { adminApi } from '../../services/adminApi';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, onSuccess, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UpdateUserPayload>({
    name: '',
    email: '',
    phone: '',
    role: UserRole.CONSUMER,
    sector: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        sector: user.sector || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setIsLoading(true);

    try {
      await adminApi.updateUser(user.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update user.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-400">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Sector / Department"
          value={formData.sector}
          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};