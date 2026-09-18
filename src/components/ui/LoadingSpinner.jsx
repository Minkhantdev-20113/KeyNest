import { classNames } from '../../utils/helpers';

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={classNames('flex items-center justify-center', className)}>
      <div
        className={classNames(
          'border-2 border-surface-200 border-t-primary-500 rounded-full animate-spin',
          sizes[size]
        )}
      />
    </div>
  );
}
