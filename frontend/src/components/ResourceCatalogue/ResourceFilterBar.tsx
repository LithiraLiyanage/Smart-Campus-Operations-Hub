// @ts-nocheck
import React, { useState, useEffect } from 'react';

// Aligned with backend ResourceType enum (ROOM, LAB, EQUIPMENT)
const RESOURCE_TYPES = ['ROOM', 'LAB', 'EQUIPMENT'];
const RESOURCE_STATUSES = ['ACTIVE', 'OUT_OF_SERVICE'];

const ResourceFilterBar = ({ onFilterChange, initialFilters }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [type, setType] = useState(initialFilters.type || '');
  const [status, setStatus] = useState(initialFilters.status || '');
  const [capacity, setCapacity] = useState(initialFilters.capacity || '');

  const [errors, setErrors] = useState({
    search: '',
    capacity: ''
  });

  // Debounced search logic inside the effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasErrors()) return;
      
      onFilterChange({
        search: searchTerm.trim(),
        type,
        status,
        capacity: capacity ? parseInt(capacity, 10) : null
      });
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, type, status, capacity]);

  const hasErrors = () => {
    return errors.search !== '' || errors.capacity !== '';
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val.length > 100) {
      setErrors((prev) => ({ ...prev, search: 'Maximum 100 characters allowed' }));
      return;
    }
    
    // Basic sanitization: prevent some extreme special chars but allow normal text
    if (/[<>{}[\]\\]/.test(val)) {
      setErrors((prev) => ({ ...prev, search: 'Invalid characters detected' }));
      return;
    }

    setErrors((prev) => ({ ...prev, search: '' }));
    setSearchTerm(val);
  };

  const handleCapacityChange = (e) => {
    const val = e.target.value;
    setCapacity(val);

    if (val && (isNaN(val) || parseInt(val, 10) <= 0)) {
      setErrors((prev) => ({ ...prev, capacity: 'Capacity must be greater than 0' }));
    } else {
      setErrors((prev) => ({ ...prev, capacity: '' }));
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setType('');
    setStatus('');
    setCapacity('');
    setErrors({ search: '', capacity: '' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-sm border border-slate-200/60 rounded-2xl p-6 mb-8 transition-all relative z-10 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative relative-group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or location..."
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-all focus:ring-2 focus:outline-none ${
                errors.search 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-300'
              }`}
            />
          </div>
          {errors.search && (
            <p className="mt-1.5 text-xs text-red-500 animate-fadeIn">{errors.search}</p>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          {/* Type Dropdown */}
          <div className="w-full sm:w-40">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="block w-full py-2.5 pl-3 pr-8 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 hover:border-slate-300 transition-all appearance-none text-slate-700"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">All Types</option>
              {RESOURCE_TYPES.map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-40">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full py-2.5 pl-3 pr-8 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 hover:border-slate-300 transition-all appearance-none text-slate-700 w-full"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">All Statuses</option>
              {RESOURCE_STATUSES.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Capacity Input */}
          <div className="w-full sm:w-28 relative">
            <input
              type="number"
              value={capacity}
              onChange={handleCapacityChange}
              placeholder="Min Cap."
              className={`block w-full px-3 py-2.5 border rounded-xl text-sm transition-all focus:ring-2 focus:outline-none ${
                errors.capacity 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-300'
              }`}
            />
            {errors.capacity && (
              <div className="absolute top-full left-0 mt-1 w-48 z-20">
                 <p className="text-xs text-red-500 bg-white p-1 rounded border border-red-100 shadow-sm animate-fadeIn">{errors.capacity}</p>
              </div>
            )}
          </div>
          
          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="flex items-center justify-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 tooltip"
            title="Clear Filters"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <span className="ml-2 sm:hidden">Clear Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceFilterBar;
