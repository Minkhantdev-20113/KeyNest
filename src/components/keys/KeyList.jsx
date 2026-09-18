import { useState } from 'react';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  Key,
} from 'lucide-react';
import { useKeys } from '../../context/KeysContext';
import { AI_PROVIDERS } from '../../config/providers';
import { maskApiKey, debounce } from '../../utils/helpers';
import { SORT_OPTIONS, VIEW_MODES } from '../../config/app';
import EmptyState from '../ui/EmptyState';
import KeyCard from './KeyCard';
import KeyTable from './KeyTable';
import KeyForm from './KeyForm';
import Modal from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function KeyList({ initialAction }) {
  const { keys, addKey, removeKey, updateKey } = useKeys();
  const toast = useToast();
  const { lock } = useAuth();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [filterProvider, setFilterProvider] = useState('');
  const [showAddForm, setShowAddForm] = useState(initialAction === 'add');
  const [editingKey, setEditingKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

  const filteredKeys = keys
    .filter(key => {
      if (filterProvider && key.provider !== filterProvider) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          key.provider?.toLowerCase().includes(q) ||
          key.description?.toLowerCase().includes(q) ||
          key.label?.toLowerCase().includes(q) ||
          key.apiKey?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.OLDEST:
          return new Date(a.createdAt) - new Date(b.createdAt);
        case SORT_OPTIONS.NAME_ASC:
          return (a.label || '').localeCompare(b.label || '');
        case SORT_OPTIONS.NAME_DESC:
          return (b.label || '').localeCompare(a.label || '');
        case SORT_OPTIONS.PROVIDER:
          return (a.provider || '').localeCompare(b.provider || '');
        case SORT_OPTIONS.NEWEST:
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleAdd = async (data) => {
    await addKey(data);
    setShowAddForm(false);
  };

  const handleEdit = async (data) => {
    if (editingKey) {
      await updateKey(editingKey.id, data);
      setEditingKey(null);
    }
  };

  const handleDelete = async () => {
    if (deletingKey) {
      await removeKey(deletingKey.id);
      setDeletingKey(null);
      toast.success('Key deleted');
    }
  };

  const providers = [...new Set(keys.map(k => k.provider))];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">API Keys</h1>
          <p className="page-subtitle">{keys.length} key{keys.length !== 1 ? 's' : ''} stored</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="btn-primary">
          <Plus size={18} />
          Add Key
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Search keys..."
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="input-field w-auto min-w-[140px]"
          >
            <option value="">All Providers</option>
            {providers.map(p => {
              const provider = AI_PROVIDERS.find(ap => ap.id === p);
              return (
                <option key={p} value={p}>{provider?.shortName || p}</option>
              );
            })}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto min-w-[140px]"
          >
            <option value={SORT_OPTIONS.NEWEST}>Newest First</option>
            <option value={SORT_OPTIONS.OLDEST}>Oldest First</option>
            <option value={SORT_OPTIONS.NAME_ASC}>Name A-Z</option>
            <option value={SORT_OPTIONS.NAME_DESC}>Name Z-A</option>
            <option value={SORT_OPTIONS.PROVIDER}>By Provider</option>
          </select>

          <div className="flex bg-surface-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode(VIEW_MODES.LIST)}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === VIEW_MODES.LIST ? 'bg-white shadow-sm text-primary-600' : 'text-surface-500'
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode(VIEW_MODES.TABLE)}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === VIEW_MODES.TABLE ? 'bg-white shadow-sm text-primary-600' : 'text-surface-500'
              }`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredKeys.length === 0 ? (
        keys.length === 0 ? (
          <EmptyState
            icon={Key}
            title="No API keys yet"
            description="Add your first API key to get started"
            action={
              <button onClick={() => setShowAddForm(true)} className="btn-primary">
                <Plus size={18} />
                Add Key
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={Search}
            title="No keys found"
            description="Try adjusting your search or filters"
          />
        )
      ) : viewMode === VIEW_MODES.LIST ? (
        <div className="space-y-3">
          {filteredKeys.map(key => (
            <KeyCard
              key={key.id}
              data={key}
              onEdit={() => setEditingKey(key)}
              onDelete={() => setDeletingKey(key)}
            />
          ))}
        </div>
      ) : (
        <KeyTable
          keys={filteredKeys}
          onEdit={(key) => setEditingKey(key)}
          onDelete={(key) => setDeletingKey(key)}
        />
      )}

      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New API Key"
        size="lg"
      >
        <KeyForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingKey}
        onClose={() => setEditingKey(null)}
        title="Edit API Key"
        size="lg"
      >
        {editingKey && (
          <KeyForm
            onSubmit={handleEdit}
            onCancel={() => setEditingKey(null)}
            initialData={editingKey}
            isEditing
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingKey}
        onClose={() => setDeletingKey(null)}
        title="Delete Key"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-surface-600">
            Are you sure you want to delete this key? This action cannot be undone.
          </p>
          {deletingKey && (
            <div className="p-3 bg-surface-50 rounded-xl">
              <p className="text-sm font-medium text-surface-800">
                {deletingKey.label || `${AI_PROVIDERS.find(p => p.id === deletingKey.provider)?.shortName || 'Unknown'} Key`}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setDeletingKey(null)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleDelete} className="btn-danger flex-1">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
