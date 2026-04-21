import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import ResourceCard from '../../components/ResourceCatalogue/ResourceCard';
import ResourceFilterBar from '../../components/ResourceCatalogue/ResourceFilterBar';
import LoadingSkeleton from '../../components/ResourceCatalogue/LoadingSkeleton';
import EmptyState from '../../components/ResourceCatalogue/EmptyState';

const UserFacilityCatalogue = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<any>({
    search: '',
    type: '',
    status: '',
    capacity: null
  });

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/resources');
      setResources(response.data || []);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      capacity: null
    });
  };

  const filteredResources = resources.filter((res: any) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchName = res.name?.toLowerCase().includes(query);
      const matchLoc = res.location?.toLowerCase().includes(query);
      if (!matchName && !matchLoc) return false;
    }
    if (filters.type && res.type !== filters.type) return false;
    if (filters.status && res.status !== filters.status) return false;
    if (filters.capacity && res.capacity < filters.capacity) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Facilities & Resources
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Discover and explore available university spaces and equipment
          </p>
        </div>

        {/* Filter Bar */}
        <ResourceFilterBar 
          onFilterChange={handleFilterChange} 
          initialFilters={filters}
        />

        {/* State Management & Content Display */}
        <div className="mt-8 transition-all duration-300">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-8 max-w-lg mx-auto text-center shadow-sm">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={fetchResources}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          ) : filteredResources.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default UserFacilityCatalogue;
