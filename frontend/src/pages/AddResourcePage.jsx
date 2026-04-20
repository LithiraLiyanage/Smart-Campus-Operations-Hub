import React from 'react';
import ResourceForm from '../components/ResourceForm';

const AddResourcePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 pl-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Add New Resource
          </h1>
          <p className="text-base text-gray-500 mt-2">
            Create a new facility or asset record in the campus catalogue.
          </p>
        </div>
        
        <ResourceForm />
      </div>
    </div>
  );
};

export default AddResourcePage;
