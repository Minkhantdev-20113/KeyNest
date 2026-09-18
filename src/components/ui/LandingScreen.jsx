import { Shield } from 'lucide-react';

export default function LandingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="text-center animate-scale-in">
        <div className="w-20 h-20 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30 animate-pulse-soft">
          <Shield size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">AI Key Vault</h1>
        <p className="text-surface-500 mb-8">Secure API Key Manager</p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
