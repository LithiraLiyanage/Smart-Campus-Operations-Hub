import React from 'react';
import type { ResourceStatus } from '../services/resourceService';

/**
 * StatusBadge mapping:
 * ACTIVE -> bg-green-100 text-green-700
 * OUT_OF_SERVICE -> bg-red-100 text-red-700
 */
const StatusBadge: React.FC<{ status: ResourceStatus }> = ({ status }) => {
  const normalized = (status || '').toString().toUpperCase();
  const isActive = normalized === 'ACTIVE';

  const label = isActive ? 'ACTIVE' : 'OUT OF SERVICE';
  const cls = isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
};

export default StatusBadge;

