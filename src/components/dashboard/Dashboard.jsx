import { Key, Shield, Activity, TrendingUp, Clock, Plus } from 'lucide-react';
import { useKeys } from '../../context/KeysContext';
import { AI_PROVIDERS } from '../../config/providers';
import { formatRelativeTime } from '../../utils/helpers';
import EmptyState from '../ui/EmptyState';

export default function Dashboard({ onNavigate }) {
  const { keys, getKeyStats, syncInfo } = useKeys();
  const stats = getKeyStats();

  const providerColors = {};
  AI_PROVIDERS.forEach(p => { providerColors[p.id] = p.color; });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your API keys</p>
        </div>
        <button onClick={() => onNavigate('keys', 'add')} className="btn-primary">
          <Plus size={18} />
          Add Key
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Key size={20} className="text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.total}</p>
              <p className="text-xs text-surface-500">Total Keys</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Shield size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.providerCount}</p>
              <p className="text-xs text-surface-500">Providers</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Activity size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 capitalize">{syncInfo.status}</p>
              <p className="text-xs text-surface-500">Sync Status</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Clock size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-surface-900">
                {syncInfo.lastSync ? formatRelativeTime(syncInfo.lastSync) : 'Never'}
              </p>
              <p className="text-xs text-surface-500">Last Sync</p>
            </div>
          </div>
        </div>
      </div>

      {keys.length === 0 ? (
        <EmptyState
          icon={Key}
          title="No API keys yet"
          description="Add your first API key to get started with AI Key Vault"
          action={
            <button onClick={() => onNavigate('keys', 'add')} className="btn-primary">
              <Plus size={18} />
              Add Your First Key
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-surface-700 mb-4">Provider Breakdown</h3>
            <div className="space-y-3">
              {stats.providerCounts
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)
                .map(({ provider, count }) => {
                  const p = AI_PROVIDERS.find(ap => ap.id === provider);
                  const percentage = (count / stats.total) * 100;
                  return (
                    <div key={provider} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: p?.color || '#64748b' }}
                      >
                        {p?.shortName?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-surface-700 truncate">
                            {p?.shortName || provider}
                          </span>
                          <span className="text-xs text-surface-500">{count}</span>
                        </div>
                        <div className="w-full bg-surface-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: p?.color || '#64748b',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-sm font-semibold text-surface-700 mb-4">Recent Keys</h3>
            <div className="space-y-2">
              {stats.recentKeys.map((key) => {
                const p = AI_PROVIDERS.find(ap => ap.id === key.provider);
                return (
                  <div
                    key={key.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer"
                    onClick={() => onNavigate('keys')}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: p?.color || '#64748b' }}
                    >
                      {p?.shortName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-700 truncate">
                        {key.label || key.description || `${p?.shortName || 'Unknown'} Key`}
                      </p>
                      <p className="text-xs text-surface-400">
                        {formatRelativeTime(key.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
