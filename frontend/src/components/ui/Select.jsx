import { forwardRef } from 'react';

export const Select = forwardRef(({ label, error, options, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">{label}</label>}
      <select
        ref={ref}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500/20' : ''} ${className}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
