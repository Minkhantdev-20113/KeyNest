import { useState } from 'react';
import { Eye, EyeOff, Copy, Edit3, Trash2, Check, Shield } from 'lucide-react';
import { AI_PROVIDERS } from '../../config/providers';
import { maskApiKey, copyToClipboard, formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

const statusColors = {
  production: 'badge-success',
  development: 'badge-warning',
  testing: 'badge-primary',
};

export default function KeyCard({ data, onEdit, onDelete }) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const provider = AI_PROVIDERS.find(p => p.id === data.provider);

  const handleCopy = async () => {
    const success = await copyToClipboard(data.apiKey);
    if (success) {
      setCopied(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="glass-card hover:shadow-xl hover:shadow-surface-200/60 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg"
          style={{ backgroundColor: provider?.color || '#64748b' }}
        >
          {provider?.shortName?.charAt(0) || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-surface-900 truncate">
                {data.label || `${provider?.shortName || 'Unknown'} Key`}
              </h3>
              <p className="text-sm text-surface-500">{provider?.shortName || data.provider}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onEdit}
                className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-primary-500 transition-colors"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <code className="text-xs font-mono text-surface-600 bg-surface-50 px-3 py-1.5 rounded-lg flex-1 truncate">
              {showKey ? data.apiKey : maskApiKey(data.apiKey)}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition-colors"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>

          {data.description && (
            <p className="mt-2 text-xs text-surface-500 truncate">{data.description}</p>
          )}

          <div className="mt-3 flex items-center gap-3 text-xs text-surface-400">
            <span className={statusColors[data.environment] || 'badge-neutral'}>
              {data.environment || 'production'}
            </span>
            <span>{formatDate(data.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
