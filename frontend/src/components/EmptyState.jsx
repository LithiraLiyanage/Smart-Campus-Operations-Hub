import React from 'react';

const EmptyState = ({ title = "No resources found", message = "We couldn't find any resources matching your criteria." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-surface-container-low rounded-2xl shadow-sm border border-surface-container-highest text-center">
      <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface/50 max-w-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
