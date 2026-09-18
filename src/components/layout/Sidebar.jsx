import { useState } from 'react';
import {
  LayoutDashboard,
  Key,
  Settings,
  LogOut,
  Lock,
  Menu,
  X,
  Shield,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useKeys } from '../../context/KeysContext';
import { classNames } from '../../utils/helpers';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'keys', label: 'API Keys', icon: Key },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { logout, lock } = useAuth();
  const { syncInfo } = useKeys();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const syncColor = {
    synced: 'text-emerald-500',
    syncing: 'text-primary-500 animate-pulse',
    offline: 'text-surface-400',
    error: 'text-red-500',
  }[syncInfo.status] || 'text-surface-400';

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl shadow-lg"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-surface-900/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={classNames(
          'fixed top-0 left-0 z-50 h-full glass-strong border-r border-surface-200/50',
          'transition-all duration-300 ease-out',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className={classNames(
            'flex items-center gap-3 px-4 h-16 border-b border-surface-200/50',
            collapsed && 'justify-center'
          )}>
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-surface-900 whitespace-nowrap">AI Key Vault</span>
            )}
            <button
              onClick={() => {
                setCollapsed(!collapsed);
                setMobileOpen(false);
              }}
              className={classNames(
                'hidden lg:flex p-1 rounded-lg hover:bg-surface-100 text-surface-400 ml-auto',
                collapsed && 'hidden'
              )}
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={classNames(
                  activePage === item.id ? 'sidebar-item-active' : 'sidebar-item',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-surface-200/50 space-y-1">
            <div className={classNames(
              'flex items-center gap-2 px-3 py-2 text-xs',
              collapsed && 'justify-center'
            )}>
              <div className={classNames('w-2 h-2 rounded-full', syncColor.replace('text-', 'bg-'))} />
              {!collapsed && (
                <span className="text-surface-500 capitalize">
                  {syncInfo.status === 'syncing' ? 'Refreshing...' : syncInfo.status}
                </span>
              )}
            </div>

            <button
              onClick={lock}
              className={classNames('sidebar-item w-full', collapsed && 'justify-center px-0')}
              title={collapsed ? 'Lock' : undefined}
            >
              <Lock size={20} className="flex-shrink-0" />
              {!collapsed && <span>Lock</span>}
            </button>

            <button
              onClick={logout}
              className={classNames('sidebar-item w-full text-red-500 hover:text-red-600 hover:bg-red-50', collapsed && 'justify-center px-0')}
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
