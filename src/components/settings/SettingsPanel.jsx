import { useState } from 'react';
import { Download, Eye, EyeOff, Palette, Shield, Upload, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useKeys } from '../../context/KeysContext';
import { useToast } from '../../context/ToastContext';
import Input from '../ui/Input';

const avatarColors = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

export default function Settings() {
  const { user, profile, saveProfile, changePassword, loading } = useAuth();
  const { keys } = useKeys();
  const toast = useToast();
  const [username, setUsername] = useState(profile?.username || user?.displayName || '');
  const [avatarText, setAvatarText] = useState(profile?.avatar?.text || '');
  const [avatarColor, setAvatarColor] = useState(profile?.avatar?.color || avatarColors[0]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleProfile = async (event) => {
    event.preventDefault();
    const success = await saveProfile({ username: username.trim(), avatar: { text: avatarText.trim().slice(0, 2).toUpperCase() || username.trim().slice(0, 2).toUpperCase(), color: avatarColor } });
    if (success) toast.success('Account settings saved');
    else toast.error('Unable to save account settings');
  };

  const handlePassword = async (event) => {
    event.preventDefault();
    if (newPassword.length < 6 || newPassword !== confirmPassword) return toast.error('Use matching passwords with at least 6 characters');
    if (await changePassword(newPassword)) { setNewPassword(''); setConfirmPassword(''); toast.success('Password updated'); }
    else toast.error('Password update failed. Sign in again if your session expired.');
  };

  const handleExport = () => {
    const data = keys.map(({ provider, label, apiKey, description, environment, createdAt }) => ({ provider, label, apiKey, description, environment, createdAt }));
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `keynest-export-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
    toast.success('Keys exported successfully');
  };

  return (
    <div className="space-y-6 animate-in max-w-2xl">
      <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Manage your account and vault preferences</p></div>
      <div className="glass-card space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-200"><div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center"><User size={20} className="text-primary-500" /></div><div><h2 className="text-base font-semibold text-surface-900">Account Profile</h2><p className="text-xs text-surface-500">{user?.email}</p></div></div>
        <form onSubmit={handleProfile} className="space-y-4">
          <Input label="Username" value={username} onChange={(event) => setUsername(event.target.value)} minLength={2} maxLength={50} required />
          <div><label className="label-text">Initial avatar (up to 2 characters)</label><input className="input-field uppercase" value={avatarText} onChange={(event) => setAvatarText(event.target.value.slice(0, 2))} maxLength={2} placeholder={username.slice(0, 2).toUpperCase()} /></div>
          <div><label className="label-text flex items-center gap-2"><Palette size={14} /> Avatar color</label><div className="flex gap-2">{avatarColors.map((color) => <button type="button" key={color} onClick={() => setAvatarColor(color)} className={`w-8 h-8 rounded-full border-2 ${avatarColor === color ? 'border-surface-900' : 'border-transparent'}`} style={{ backgroundColor: color }} aria-label={`Use ${color} avatar color`} />)}</div></div>
          <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full text-white font-bold flex items-center justify-center" style={{ backgroundColor: avatarColor }}>{(avatarText || username.slice(0, 2)).toUpperCase()}</div><span className="text-sm text-surface-500">Your avatar is stored as text and color only.</span></div>
          <button className="btn-primary" type="submit" disabled={loading}>Save Profile</button>
        </form>
      </div>
      <div className="glass-card space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-200"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Shield size={20} className="text-amber-500" /></div><div><h2 className="text-base font-semibold text-surface-900">Password & Security</h2><p className="text-xs text-surface-500">Update your Firebase account password</p></div></div>
        <form onSubmit={handlePassword} className="space-y-4"><div className="relative"><Input label="New password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={6} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-3 text-surface-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><Input label="Confirm new password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={6} required /><button className="btn-primary" type="submit" disabled={loading}>Change Password</button></form>
      </div>
      <div className="glass-card space-y-5"><div className="flex items-center gap-3 pb-4 border-b border-surface-200"><Download size={20} className="text-emerald-500" /><div><h2 className="text-base font-semibold text-surface-900">Vault Backup</h2><p className="text-xs text-surface-500">Export your keys for secure offline backup</p></div></div><div className="flex gap-3"><button onClick={handleExport} className="btn-secondary flex-1"><Download size={16} /> Export Keys</button><button onClick={() => toast.info('Import is intentionally disabled until a validation flow is added.')} className="btn-secondary flex-1"><Upload size={16} /> Import Keys</button></div><p className="text-xs text-surface-400">Export files contain API key values. Store them securely.</p></div>
    </div>
  );
}
