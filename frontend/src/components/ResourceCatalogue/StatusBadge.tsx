// @ts-nocheck
import React from 'react';

const StatusBadge = ({ status }) => {
  const isAvailable = status === 'ACTIVE';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors duration-300 ${
        isAvailable
          ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
          : 'bg-red-50 text-red-700 border-red-200 shadow-sm'
      }`}
    >
      {isAvailable ? (
        <>
          <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Active
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full"></span>
          Out of Service
        </>
      )}
    </span>
  );
};

export default StatusBadge;
