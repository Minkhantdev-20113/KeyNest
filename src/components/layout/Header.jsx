import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useKeys } from '../../context/KeysContext';
import { useToast } from '../../context/ToastContext';

export default function Header() {
  const { syncInfo, sync } = useKeys();
  const toast = useToast();

  const handleSync = async () => {
    if (!syncInfo.isOnline) {
      toast.warning('You are offline. Firebase changes require a connection.');
      return;
    }
    const result = await sync();
    if (result?.status === 'synced') {
      toast.success('Firebase data refreshed successfully');
    } else if (result?.status === 'error') {
      toast.error(result.message || 'Sync failed');
    }
  };

  return (
    <header className="h-16 glass border-b border-surface-200/50 flex items-center justify-end px-6 gap-3">
      <div className="flex items-center gap-2 text-xs text-surface-500">
        {syncInfo.isOnline ? (
          <Wifi size={14} className="text-emerald-500" />
        ) : (
          <WifiOff size={14} className="text-surface-400" />
        )}
        <span>{syncInfo.isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {syncInfo.pendingCount > 0 && (
        <span className="badge-warning text-xs">
          {syncInfo.pendingCount} pending
        </span>
      )}

      <button
        onClick={handleSync}
        disabled={syncInfo.status === 'syncing'}
        className="btn-ghost text-sm"
      >
        <RefreshCw
          size={16}
          className={syncInfo.status === 'syncing' ? 'animate-spin' : ''}
        />
        <span className="hidden sm:inline">Sync</span>
      </button>
    </header>
  );
}
