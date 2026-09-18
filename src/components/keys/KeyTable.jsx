import { useState } from 'react';
import { Eye, EyeOff, Copy, Edit3, Trash2, Check } from 'lucide-react';
import { AI_PROVIDERS } from '../../config/providers';
import { maskApiKey, copyToClipboard, formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

const statusColors = {
  production: 'badge-success',
  development: 'badge-warning',
  testing: 'badge-primary',
};

export default function KeyTable({ keys, onEdit, onDelete }) {
  const [visibleKeys, setVisibleKeys] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const toast = useToast();

  const handleCopy = async (key) => {
    const success = await copyToClipboard(key.apiKey);
    if (success) {
      setCopiedId(key.id);
      toast.success('API key copied');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleVisibility = (id) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200">
              <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">Provider</th>
              <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">Label</th>
              <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">API Key</th>
              <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">Environment</th>
              <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">Created</th>
              <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {keys.map((key) => {
              const provider = AI_PROVIDERS.find(p => p.id === key.provider);
              return (
                <tr key={key.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: provider?.color || '#64748b' }}
                      >
                        {provider?.shortName?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm font-medium text-surface-700">
                        {provider?.shortName || key.provider}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-surface-700 truncate max-w-[200px] block">
                      {key.label || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-surface-600 bg-surface-50 px-2 py-1 rounded max-w-[200px] truncate block">
                        {visibleKeys[key.id] ? key.apiKey : maskApiKey(key.apiKey)}
                      </code>
                      <button
                        onClick={() => toggleVisibility(key.id)}
                        className="p-1 rounded hover:bg-surface-100 text-surface-400"
                      >
                        {visibleKeys[key.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button
                        onClick={() => handleCopy(key)}
                        className="p-1 rounded hover:bg-surface-100 text-surface-400"
                      >
                        {copiedId === key.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={statusColors[key.environment] || 'badge-neutral'}>
                      {key.environment || 'production'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-surface-500">{formatDate(key.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(key)}
                        className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-primary-500 transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(key)}
                        className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
