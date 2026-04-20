import React, { useState } from 'react';

const ResourceFilterBar = ({ onFilterChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minCapacity: ''
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    const emptyFilters = { type: '', status: '', minCapacity: '' };
    setFilters(emptyFilters);
    onSearch('');
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-surface-container-low p-4 rounded-2xl shadow-sm border border-surface-container-highest mb-8 z-10 w-full relative">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-on-surface/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search resources by name or location..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-surface-container-highest rounded-xl leading-5 bg-surface-container-highest placeholder-on-surface/40 text-on-surface focus:outline-none focus:bg-surface-container-highest focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
            />
            <button 
              type="submit" 
              className="absolute inset-y-1 right-1 px-4 text-sm font-medium text-white bg-primary hover:bg-primary-container rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-48">
          <label className="block text-xs font-semibold text-on-surface/70 uppercase tracking-wider mb-2">Resource Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="block w-full pl-3 pr-10 py-2.5 text-base border border-surface-container-highest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-xl bg-surface-container-highest custom-select"
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Laboratory</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <label className="block text-xs font-semibold text-on-surface/70 uppercase tracking-wider mb-2">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="block w-full pl-3 pr-10 py-2.5 text-base border border-surface-container-highest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-xl bg-surface-container-highest custom-select"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Available</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <label className="block text-xs font-semibold text-on-surface/70 uppercase tracking-wider mb-2">Min Capacity</label>
          <input
            type="number"
            name="minCapacity"
            value={filters.minCapacity}
            onChange={handleFilterChange}
            placeholder="e.g. 50"
            className="block w-full pl-3 pr-3 py-2.5 border border-surface-container-highest rounded-xl leading-5 bg-surface-container-highest placeholder-on-surface/40 text-on-surface focus:outline-none focus:bg-surface-container-highest focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
          />
        </div>

        <div className="ml-auto w-full md:w-auto">
          <button
            onClick={handleClearFilters}
            className="w-full md:w-auto px-4 py-2.5 text-sm font-medium text-on-surface/70 bg-surface-container-low border border-surface-container-highest rounded-xl hover:bg-surface-container-highest hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceFilterBar;
