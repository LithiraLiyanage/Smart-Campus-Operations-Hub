// @ts-nocheck
import React from 'react';

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm">
      <div className="w-24 h-24 mb-6 rounded-full bg-indigo-50 flex items-center justify-center border-4 border-white shadow-sm">
        <svg
          className="w-10 h-10 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">No resources found</h3>
      <p className="text-slate-500 max-w-sm mb-8">
        We couldn't find any resources matching your current filters. Try adjusting your search criteria to find what you're looking for.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all duration-200 shadow-sm hover:shadow"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default EmptyState;
