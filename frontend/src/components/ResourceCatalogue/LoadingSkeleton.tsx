// @ts-nocheck
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
            <div className="w-20 h-6 bg-slate-100 rounded-full"></div>
          </div>
          
          <div className="w-3/4 h-6 bg-slate-200 rounded-lg mb-3"></div>
          <div className="w-1/2 h-4 bg-slate-100 rounded-lg mb-6"></div>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
              <div className="w-24 h-4 bg-slate-100 rounded-md"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
              <div className="w-32 h-4 bg-slate-100 rounded-md"></div>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="w-full h-11 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
