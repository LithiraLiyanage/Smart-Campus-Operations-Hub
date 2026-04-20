import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';

const ResourceForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    description: '',
    availableFrom: '',
    availableTo: '',
    status: 'ACTIVE'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate times loosely or rely on backend
      await resourceService.createResource({
        ...formData,
        capacity: formData.capacity === '' ? 0 : parseInt(formData.capacity, 10)
      });
      setSuccess(true);
      setTimeout(() => {
        // Option to navigate back or just stay and show success
        navigate('/resources');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating the resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to catalogue or dashboard depending on admin flow
    navigate('/resources');
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface-container-highest rounded-2xl shadow-sm border border-surface-container-highest overflow-hidden mt-8">
      <div className="px-6 py-6 border-b border-surface-container-highest bg-surface-container-low">
        <h2 className="text-xl font-bold text-on-surface">Resource Details</h2>
        <p className="text-sm text-on-surface/50 mt-1">Provide the specific details for the new facility or asset.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-900/50 flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-900/20 border border-emerald-900/50 flex items-start">
            <svg className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-400">Resource created successfully! Redirecting...</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-on-surface/80 mb-1">Resource Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-surface-container-highest rounded-xl focus:ring-primary focus:border-primary text-sm bg-surface-container-low focus:bg-surface-container-highest text-on-surface transition-colors"
                placeholder="e.g. Main Auditorium"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Resource Type <span className="text-red-500">*</span></label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-surface-container-highest rounded-xl focus:ring-primary focus:border-primary text-sm bg-surface-container-low focus:bg-surface-container-highest text-on-surface transition-colors custom-select"
              >
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Laboratory</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Capacity <span className="text-red-500">*</span></label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-surface-container-highest rounded-xl focus:ring-primary focus:border-primary text-sm bg-surface-container-low focus:bg-surface-container-highest text-on-surface transition-colors"
                placeholder="e.g. 150"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-surface-container-highest rounded-xl focus:ring-primary focus:border-primary text-sm bg-surface-container-low focus:bg-surface-container-highest text-on-surface transition-colors"
                placeholder="e.g. Building A, Floor 2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-surface-container-highest rounded-xl focus:ring-primary focus:border-primary text-sm bg-surface-container-low focus:bg-surface-container-highest text-on-surface transition-colors"
              placeholder="Provide any additional details or amenities available..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700 mb-1">Available From <span className="text-red-500">*</span></label>
              <input
                type="time"
                id="availableFrom"
                name="availableFrom"
                required
                value={formData.availableFrom}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-surface-container-highest rounded-xl focus:ring-primary focus:border-primary text-sm bg-surface-container-low focus:bg-surface-container-highest text-on-surface transition-colors"
              />
            </div>

            <div>
              <label htmlFor="availableTo" className="block text-sm font-medium text-gray-700 mb-1">Available To <span className="text-red-500">*</span></label>
              <input
                type="time"
                id="availableTo"
                name="availableTo"
                required
                value={formData.availableTo}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-surface-container-highest rounded-xl focus:ring-primary focus:border-primary text-sm bg-surface-container-low focus:bg-surface-container-highest text-on-surface transition-colors"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-surface-container-highest rounded-xl focus:ring-primary focus:border-primary text-sm bg-surface-container-low focus:bg-surface-container-highest text-on-surface transition-colors custom-select"
              >
                <option value="ACTIVE">Active / Available</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end space-x-4 pt-6 border-t border-surface-container-highest">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-surface-container-highest rounded-xl shadow-sm text-sm font-medium text-on-surface bg-surface-container-low hover:bg-surface-container-highest hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-container shadow-glass focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Resource'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;
