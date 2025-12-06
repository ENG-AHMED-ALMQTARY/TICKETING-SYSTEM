import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui/Base';
import { UserRole } from '../../types';

const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'consumer@test.com', role: UserRole.CONSUMER },
  { id: '2', name: 'Sarah Tech', email: 'tech@test.com', role: UserRole.TECHNICIAN },
  { id: '3', name: 'Mike Manager', email: 'manager@test.com', role: UserRole.MANAGER },
  { id: '4', name: 'Alice Admin', email: 'admin@test.com', role: UserRole.ADMIN },
];

export const UserList: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white font-display">User Management</h1>
           <p className="text-slate-400">Manage system access and roles.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Add User</Button>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {MOCK_USERS.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                <td className="px-6 py-4"><Badge>{user.role}</Badge></td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-indigo-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                  <button className="text-red-400 hover:text-white"><Trash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
};
