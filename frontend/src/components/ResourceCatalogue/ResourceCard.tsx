// @ts-nocheck
import React from 'react';
import StatusBadge from './StatusBadge';

const formatTime = (timeString) => {
  if (!timeString) return '';
  try {
    // Basic formatting for time, expecting HH:mm or similar
    // We'll keep it simple: just show the string or format if needed.
    return timeString.substring(0, 5);
  } catch (e) {
    return timeString;
  }
};

const ResourceCard = ({ resource }) => {
  const {
    name,
    type,
    capacity,
    location,
    availableFrom,
    availableTo,
    status
  } = resource;

  const formatType = (typeStr) => {
    return typeStr ? typeStr.replace(/_/g, ' ') : 'UNKNOWN';
  };

  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200 relative overflow-hidden flex flex-col h-full">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
          {formatType(type)}
        </span>
        <StatusBadge status={status} />
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-700 transition-colors">
        {name}
      </h3>
      
      <div className="flex-grow space-y-4 my-5">
        <div className="flex items-start text-sm text-slate-600">
          <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="line-clamp-2">{location}</span>
        </div>

        <div className="flex items-center text-sm text-slate-600">
          <svg className="w-5 h-5 text-indigo-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span>Capacity: <strong className="font-semibold text-slate-800">{capacity}</strong> people</span>
        </div>

        <div className="flex items-center text-sm text-slate-600">
          <svg className="w-5 h-5 text-indigo-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>{formatTime(availableFrom)} - {formatTime(availableTo)}</span>
        </div>
      </div>

      <div className="mt-auto pt-2">
        <button 
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform border border-transparent"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
