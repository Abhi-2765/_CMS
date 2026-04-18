export const Badge = ({ children, status, className = '' }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    ASSIGNED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  };

  const colorStyle = statusColors[status] || statusColors.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorStyle} ${className}`}>
      {children || status}
    </span>
  );
};
