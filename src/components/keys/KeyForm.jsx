import { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, Loader2, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AI_PROVIDERS } from '../../config/providers';
import { useToast } from '../../context/ToastContext';
import { testApiKey } from '../../services/api';

function ProviderLogo({ provider }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
        style={{ backgroundColor: provider.color }}
      >
        {provider.shortName.charAt(0)}
      </span>
    );
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-surface-200">
      <img
        src={provider.logoUrl}
        alt=""
        className="h-6 w-6 object-contain"
        onError={() => setHasError(true)}
      />
    </span>
  );
}

export default function KeyForm({ onSubmit, onCancel, initialData, isEditing = false }) {
  const toast = useToast();
  const [form, setForm] = useState({
    provider: '',
    apiKey: '',
    label: '',
    description: '',
    environment: 'production',
    ...initialData,
  });
  const [showKey, setShowKey] = useState(false);
  const [errors, setErrors] = useState({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAllProviders, setShowAllProviders] = useState(
    () => Boolean(initialData?.provider && AI_PROVIDERS.findIndex(p => p.id === initialData.provider) >= 6)
  );

  const selectedProvider = AI_PROVIDERS.find(p => p.id === form.provider);
  const visibleProviders = showAllProviders ? AI_PROVIDERS : AI_PROVIDERS.slice(0, 6);
  const hiddenProviderCount = AI_PROVIDERS.length - 6;

  const validate = () => {
    const errs = {};
    if (!form.provider) errs.provider = 'Please select a provider';
    if (!form.apiKey || form.apiKey.trim().length < 8) errs.apiKey = 'API key must be at least 8 characters';
    if (form.description && form.description.length > 200) errs.description = 'Description must be 200 characters or less';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        provider: form.provider,
        apiKey: form.apiKey.trim(),
        label: form.label.trim() || `${selectedProvider?.shortName || 'Unknown'} Key`,
        description: form.description.trim(),
      });
      toast.success(isEditing ? 'Key updated successfully' : 'Key added successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save key');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTest = async () => {
    if (!form.provider || !form.apiKey) {
      toast.warning('Please select a provider and enter an API key first');
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testApiKey(form.provider, form.apiKey);
      setTestResult(result);
      if (result.success) {
        toast.success('API key is valid and working');
      } else {
        toast.warning(result.message);
      }
    } catch (err) {
      toast.error('Test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="mb-2 flex items-end justify-between gap-3">
          <div>
            <label className="label-text mb-0">AI Provider *</label>
            <p className="mt-1 text-xs text-surface-400">Choose where this key will be used</p>
          </div>
          {selectedProvider && (
            <span className="hidden items-center gap-1.5 text-xs font-medium text-primary-600 sm:flex">
              <Check size={13} /> Selected
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {visibleProviders.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => {
                setForm(prev => ({ ...prev, provider: provider.id }));
                setErrors(prev => ({ ...prev, provider: undefined }));
                setTestResult(null);
              }}
              className={`group relative flex min-h-[72px] items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all duration-200 ${
                form.provider === provider.id
                  ? 'border-primary-500 bg-primary-50/70 shadow-md shadow-primary-500/10'
                  : 'border-surface-200 bg-white/50 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:shadow-sm'
              }`}
            >
              <ProviderLogo provider={provider} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-surface-800">{provider.shortName}</p>
                <p className="mt-0.5 truncate text-[11px] text-surface-400">{provider.description}</p>
              </div>
              {form.provider === provider.id && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAllProviders(prev => !prev)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-surface-300 py-2 text-xs font-semibold text-surface-500 transition-colors hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-600"
        >
          {showAllProviders ? 'Show fewer providers' : `See more providers (${hiddenProviderCount})`}
          {showAllProviders ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {errors.provider && <p className="mt-1 text-xs text-red-500">{errors.provider}</p>}
      </div>

      <div>
        <label className="label-text">API Key *</label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={form.apiKey}
            onChange={(e) => {
              setForm(prev => ({ ...prev, apiKey: e.target.value }));
              setErrors(prev => ({ ...prev, apiKey: undefined }));
              setTestResult(null);
            }}
            className="input-field pr-24 font-mono text-sm"
            placeholder="Enter your API key"
            autoComplete="off"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !form.provider || !form.apiKey}
              className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 disabled:opacity-50"
            >
              {testing ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
            </button>
          </div>
        </div>
        {errors.apiKey && <p className="mt-1 text-xs text-red-500">{errors.apiKey}</p>}
        {testResult && (
          <div className={`mt-2 p-3 rounded-xl text-sm flex items-center gap-2 ${
            testResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {testResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
            {testResult.message}
          </div>
        )}
      </div>

      <div>
        <label className="label-text">Label</label>
        <input
          type="text"
          value={form.label}
          onChange={(e) => setForm(prev => ({ ...prev, label: e.target.value }))}
          className="input-field"
          placeholder="e.g., My Production Key"
        />
      </div>

      <div>
        <label className="label-text">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => {
            setForm(prev => ({ ...prev, description: e.target.value }));
            setErrors(prev => ({ ...prev, description: undefined }));
          }}
          className="input-field resize-none h-20"
          placeholder="Optional description for this key"
          maxLength={200}
        />
        <p className="mt-1 text-xs text-surface-400 text-right">{form.description.length}/200</p>
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label className="label-text">Environment</label>
        <div className="flex gap-2">
          {['production', 'development', 'testing'].map((env) => (
            <button
              key={env}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, environment: env }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                form.environment === env
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {env.charAt(0).toUpperCase() + env.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 flex gap-3 py-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn-primary flex-1">
          {submitting ? 'Saving...' : isEditing ? 'Update Key' : 'Add Key'}
        </button>
      </div>
    </form>
  );
}
