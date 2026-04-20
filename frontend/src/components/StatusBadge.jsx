import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const isActive = status === 'ACTIVE';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          : 'bg-rose-100 text-rose-800 border border-rose-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
      {isActive ? 'Available' : 'Out of Service'}
    </span>
  );
};

export default StatusBadge;
