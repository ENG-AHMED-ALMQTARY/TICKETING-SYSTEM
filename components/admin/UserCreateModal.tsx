import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Button } from '../ui/Base';
import { UserRole, CreateUserPayload } from '../../types';
import { adminApi } from '../../services/adminApi';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserCreateModal: React.FC<UserCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateUserPayload>({
    name: '',
    email: '',
    phone: '',
    role: UserRole.CONSUMER,
    sector: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email) {
      setError('Name and Email are required');
      return;
    }

    setIsLoading(true);
    try {
      await adminApi.createUser(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: UserRole.CONSUMER,
        sector: ''
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Jane Smith"
          required
        />
        
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="jane@company.com"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 555-000-0000"
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
          placeholder="e.g. Retail, IT, Logistics"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            <Save className="w-4 h-4 mr-2" /> Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
};