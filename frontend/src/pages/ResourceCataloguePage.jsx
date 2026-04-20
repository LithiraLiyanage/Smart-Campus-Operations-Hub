import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import ResourceCard from '../components/ResourceCard';
import ResourceFilterBar from '../components/ResourceFilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

// Dummy data fallback for demonstration if API fails
const MOCK_RESOURCES = [
  {
    id: 1,
    name: 'Main Auditorium',
    type: 'LECTURE_HALL',
    capacity: 350,
    location: 'Building A, Ground Floor',
    description: 'Large state-of-the-art auditorium with smartboard and AV system.',
    availableFrom: '08:00',
    availableTo: '20:00',
    status: 'ACTIVE'
  },
  {
    id: 2,
    name: 'Advanced Computing Lab',
    type: 'LAB',
    capacity: 60,
    location: 'IT Complex, 2nd Floor',
    description: 'Equipped with 60 high-performance workstations for intensive computing.',
    availableFrom: '08:00',
    availableTo: '18:00',
    status: 'ACTIVE'
  },
  {
    id: 3,
    name: 'Executive Boardroom',
    type: 'MEETING_ROOM',
    capacity: 20,
    location: 'Admin Block, 1st Floor',
    description: 'Premium meeting space with video conferencing facilities.',
    availableFrom: '09:00',
    availableTo: '17:00',
    status: 'OUT_OF_SERVICE'
  },
  {
    id: 4,
    name: 'Mobile Projector Pro',
    type: 'EQUIPMENT',
    capacity: 0,
    location: 'Resource Center',
    description: '4K mobile projector on cart with built-in speakers.',
    availableFrom: '08:00',
    availableTo: '19:00',
    status: 'ACTIVE'
  }
];

const ResourceCataloguePage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceService.getAllResources();
      setResources(data);
      setFilteredResources(data);
      setUsingMockData(false);
    } catch (err) {
      console.error('Failed to fetch from real API, falling back to mock data:', err);
      // Fallback to mock data to ensure student presentation works
      setResources(MOCK_RESOURCES);
      setFilteredResources(MOCK_RESOURCES);
      setUsingMockData(true);
      setError('Could not connect to live server. Displaying mock data for demonstration.');
    } finally {
      setLoading(false);
    }
  };

  // Improved filtering logic
  const [activeSearch, setActiveSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({ type: '', status: '', minCapacity: '' });

  const handleSearchUpdate = (term) => {
    setActiveSearch(term);
  };

  const handleFiltersUpdate = (filters) => {
    setActiveFilters(filters);
  };

  useEffect(() => {
    let result = [...resources];

    // Apply Search
    if (activeSearch) {
      const lowerSearch = activeSearch.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(lowerSearch) || 
        r.location.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply Type Filter
    if (activeFilters.type) {
      result = result.filter(r => r.type === activeFilters.type);
    }

    // Apply Status Filter
    if (activeFilters.status) {
      result = result.filter(r => r.status === activeFilters.status);
    }

    // Apply Capacity Filter
    if (activeFilters.minCapacity) {
      result = result.filter(r => r.capacity >= parseInt(activeFilters.minCapacity, 10));
    }

    setFilteredResources(result);
  }, [resources, activeSearch, activeFilters]);

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Facilities & Resource Catalogue
          </h1>
          <p className="text-base md:text-lg text-on-surface/50 max-w-2xl mx-auto">
            Browse, search and view available facilities, laboratories, and equipment across the university campus.
          </p>
        </div>

        {error && usingMockData && (
          <div className="max-w-7xl mx-auto mb-6 bg-amber-900/20 border border-amber-900/50 text-amber-500 px-4 py-3 rounded-xl flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Filter Bar */}
        <ResourceFilterBar 
          onSearch={handleSearchUpdate} 
          onFilterChange={handleFiltersUpdate} 
        />

        {/* Content Section */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredResources.length === 0 ? (
          <EmptyState 
            title="No Resources Found" 
            message="No available facilities or equipment match your current search and filter criteria. Try adjusting them."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCataloguePage;
