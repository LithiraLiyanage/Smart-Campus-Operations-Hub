import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const MOCK_RESOURCES = [
  {
    id: 1,
    name: 'Main Auditorium',
    type: 'LECTURE_HALL',
    capacity: 350,
    location: 'Building A, Ground Floor',
    description: 'Large state-of-the-art auditorium with smartboard, dual 4K projectors, and Dolby surround AV system. Ideal for major lectures, guest speaker events, and orientations.',
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
    description: 'Equipped with 60 high-performance workstations for intensive computing. Includes pre-installed industry standard software for engineering and computer science students.',
    availableFrom: '08:00',
    availableTo: '18:00',
    status: 'ACTIVE'
  }
];

const ResourceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResourceDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResourceById(id);
      setResource(data);
    } catch (err) {
      console.error(`Failed to fetch resource ${id}, checking mock data.`, err);
      // Fallback
      const mockData = MOCK_RESOURCES.find(r => r.id.toString() === id) || MOCK_RESOURCES[0];
      setResource(mockData);
      setError('Viewing offline mock data for demonstration.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/resources');
  };

  const formatType = (type) => {
    if (!type) return '';
    return type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-surface-container-highest p-8 rounded-2xl border border-surface-container-highest shadow-glass text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Resource Not Found</h2>
          <p className="text-on-surface/50 mb-6">The requested facility or resource could not be found.</p>
          <button onClick={handleBack} className="text-primary hover:text-primary-container font-medium pb-1 border-b border-transparent hover:border-primary transition-colors">
            &larr; Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={handleBack}
          className="group flex items-center text-sm font-medium text-on-surface/60 hover:text-primary mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2 text-on-surface/40 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Catalogue
        </button>

        {error && (
          <div className="mb-6 bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-xl flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Main Details Card */}
        <div className="bg-surface-container-low rounded-3xl shadow-card border border-surface-container-highest overflow-hidden">
          
          <div className="p-8 md:p-12 lg:p-14">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
                  {formatType(resource.type)}
                </p>
                <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
                  {resource.name}
                </h1>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={resource.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-3 border-b border-surface-container-highest pb-2">Description</h3>
                  <p className="text-on-surface/70 leading-relaxed">
                    {resource.description || 'No detailed description available for this resource.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-surface-container-highest border border-surface-container-highest p-5 rounded-2xl">
                    <div className="text-sm font-semibold text-on-surface/50 uppercase tracking-wider mb-1">Capacity</div>
                    <div className="text-xl font-bold text-on-surface flex items-center">
                      <svg className="w-5 h-5 mr-2 text-on-surface/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {resource.capacity > 0 ? `${resource.capacity} Persons` : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-surface-container-highest border border-surface-container-highest p-5 rounded-2xl">
                    <div className="text-sm font-semibold text-on-surface/50 uppercase tracking-wider mb-1">Availability</div>
                    <div className="text-xl font-bold text-on-surface flex items-center">
                      <svg className="w-5 h-5 mr-2 text-on-surface/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {resource.availableFrom} - {resource.availableTo}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-surface-container-highest pt-8 md:pt-0 md:pl-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Location</h3>
                  <div className="flex items-start text-on-surface/70 mb-8">
                    <svg className="w-5 h-5 mr-3 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="leading-tight">{resource.location}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button 
                    disabled={resource.status !== 'ACTIVE'}
                    className={`w-full py-4 px-6 rounded-xl text-center font-bold text-sm uppercase tracking-wide transition-all shadow-sm ${
                      resource.status === 'ACTIVE' 
                        ? 'bg-primary hover:bg-primary-container text-white shadow-glass hover:shadow-card-hover transform hover:-translate-y-0.5' 
                        : 'bg-surface-container-lowest text-on-surface/20 cursor-not-allowed border border-surface-container-highest'
                    }`}
                  >
                    {resource.status === 'ACTIVE' ? 'Book Now' : 'Currently Unavailable'}
                  </button>
                  <p className="text-xs text-center text-on-surface/40 mt-3">
                    Subject to approval and scheduling.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceDetailsPage;
