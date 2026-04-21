import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ResourceFilters from '../components/ResourceFilters';
import ResourceForm from '../components/ResourceForm';
import ResourceTable from '../components/ResourceTable';
import { useAuthStore } from '../store/authStore';
import type { Resource, ResourceFilters as Filters } from '../services/resourceService';
import { resourceService } from '../services/resourceService';

const defaultFilters: Filters = {
  type: undefined,
  capacity: undefined,
  location: undefined,
  status: undefined,
};

const ResourcesPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  const alertTimerRef = useRef<number | null>(null);

  const clearAlertSoon = useCallback(() => {
    if (alertTimerRef.current != null) {
      window.clearTimeout(alertTimerRef.current);
    }
    alertTimerRef.current = window.setTimeout(() => setAlert(null), 3500);
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      setAlert({ type: 'success', message });
      clearAlertSoon();
    },
    [clearAlertSoon]
  );

  const showError = useCallback(
    (message: string) => {
      setAlert({ type: 'error', message });
      clearAlertSoon();
    },
    [clearAlertSoon]
  );

  const fetchResources = useCallback(
    async (activeFilters: Filters) => {
      setLoading(true);
      try {
        const data = await resourceService.getResources(activeFilters);
        setResources(Array.isArray(data) ? data : []);
      } catch {
        showError('Failed to load resources. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    return () => {
      if (alertTimerRef.current != null) {
        window.clearTimeout(alertTimerRef.current);
      }
    };
  }, []);

  // Dynamic filtering: refetch when filters change
  useEffect(() => {
    fetchResources(filters);
  }, [filters, fetchResources]);

  const title = useMemo(() => (isAdmin ? 'Facilities & Assets (Admin)' : 'Facilities & Assets'), [isAdmin]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (resource: Resource) => {
    setEditing(resource);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleDelete = async (resource: Resource) => {
    if (!resource?.id) {
      showError('Cannot delete: missing resource id.');
      return;
    }

    const ok = window.confirm(`Delete "${resource.name}"? This action cannot be undone.`);
    if (!ok) return;

    try {
      setLoading(true);
      await resourceService.deleteResource(resource.id);
      showSuccess('Resource deleted successfully.');
      await fetchResources(filters);
    } catch {
      showError('Delete failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (payload: Omit<Resource, 'id'>) => {
    try {
      setSubmitting(true);
      if (editing?.id) {
        await resourceService.updateResource(editing.id, payload);
        showSuccess('Resource updated successfully.');
      } else {
        await resourceService.createResource(payload);
        showSuccess('Resource created successfully.');
      }
      closeForm();
      await fetchResources(filters);
    } catch {
      showError('Operation failed. Please check your input and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm sm:text-base text-slate-500">
              Manage campus resources, streamline bookings, and keep assets operational.
            </p>
          </div>

          {isAdmin ? (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-semibold shadow-sm"
            >
              + Create Resource
            </button>
          ) : null}
        </div>

        {alert ? (
          <div
            className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium border ${
              alert.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
            role="alert"
          >
            {alert.message}
          </div>
        ) : null}

        <div className="mt-8">
          <ResourceFilters
            value={filters}
            onChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            onClear={() => setFilters(defaultFilters)}
          />
        </div>

        <div className="mt-6">
          <ResourceTable
            resources={resources}
            isAdmin={!!isAdmin}
            onEdit={openEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>

        {/* Form panel */}
        {isAdmin && formOpen ? (
          <div className="mt-8">
            <ResourceForm
              mode={editing ? 'edit' : 'create'}
              initialValue={editing}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              submitting={submitting}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResourcesPage;

