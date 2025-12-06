
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash, Search, Mail, Phone, Briefcase } from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/ui/Base';
import { User } from '../../types';
import { adminApi } from '../../services/adminApi';
import { useLanguageStore } from '../../store/useLanguageStore';
import { UserCreateModal } from '../../components/admin/UserCreateModal';
import { UserEditModal } from '../../components/admin/UserEditModal';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { t, direction } = useLanguageStore();
  
  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      // Keep loading true only on initial load if list is empty
      if (users.length === 0) setIsLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (deletingUser) {
      await adminApi.deleteUser(deletingUser.id);
      fetchUsers(); // Refresh list
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white font-display">{t('userManagement')}</h1>
           <p className="text-slate-400">{t('userManagementSubtitle')}</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> {t('addUser')}
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div className="relative flex-1 max-w-md">
           <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`} />
           <Input 
             placeholder={t('searchUsers')} 
             className={`${direction === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {/* User Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin w-8 h-8 border-b-2 border-indigo-500 rounded-full"></div>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">{t('userProfile')}</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">{t('contact')}</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">{t('roleSector')}</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right rtl:text-left">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <AnimatePresence>
                  {filteredUsers.map(user => (
                    <motion.tr 
                      key={user.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white">{user.name}</div>
                            <div className="text-xs text-slate-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-slate-300">
                            <Mail className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0 text-slate-500" /> {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center text-sm text-slate-300">
                              <Phone className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0 text-slate-500" /> {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <Badge variant={user.role === 'ADMIN' ? 'warning' : 'info'}>{user.role}</Badge>
                          {user.sector && (
                            <div className="flex items-center text-xs text-slate-400">
                              <Briefcase className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {user.sector}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left space-x-2 rtl:space-x-reverse">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-all"
                          title={t('editUser')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingUser(user)}
                          className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                          title={t('deleteUser')}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      {t('noUsersFound')} "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <UserCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={fetchUsers} 
      />
      
      <UserEditModal 
        isOpen={!!editingUser} 
        user={editingUser}
        onClose={() => setEditingUser(null)} 
        onSuccess={fetchUsers} 
      />

      <ConfirmDeleteModal 
        isOpen={!!deletingUser}
        userName={deletingUser?.name || ''}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
};
