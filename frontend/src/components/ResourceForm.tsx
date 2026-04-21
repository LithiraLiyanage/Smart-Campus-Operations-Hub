import React, { useEffect, useMemo, useState } from 'react';
import type { Resource, ResourceStatus, ResourceType } from '../services/resourceService';

const TYPES: ResourceType[] = ['ROOM', 'LAB', 'EQUIPMENT'];
const STATUSES: ResourceStatus[] = ['ACTIVE', 'OUT_OF_SERVICE'];

/**
 * ResourceForm supports:
 * - Create (POST)
 * - Update (PUT)
 *
 * Validation:
 * - required fields
 * - capacity > 0
 */
const ResourceForm: React.FC<{
  mode: 'create' | 'edit';
  initialValue?: Partial<Resource> | null;
  onSubmit: (payload: Omit<Resource, 'id'>) => void;
  onCancel: () => void;
  submitting?: boolean;
}> = ({ mode, initialValue, onSubmit, onCancel, submitting }) => {
  const isEdit = mode === 'edit';

  const initial = useMemo(
    () => ({
      name: initialValue?.name ?? '',
      type: (initialValue?.type as ResourceType) ?? 'ROOM',
      capacity: typeof initialValue?.capacity === 'number' ? String(initialValue.capacity) : '',
      location: initialValue?.location ?? '',
      status: (initialValue?.status as ResourceStatus) ?? 'ACTIVE',
    }),
    [initialValue]
  );

  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(initial);
    setTouched({});
  }, [initial]);

  const setField = (key: keyof typeof values, val: string) => setValues((v) => ({ ...v, [key]: val }));
  const touch = (key: string) => setTouched((t) => ({ ...t, [key]: true }));

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = 'Name is required.';
    if (!values.type) e.type = 'Type is required.';
    const cap = Number(values.capacity);
    if (!values.capacity.trim() || Number.isNaN(cap)) e.capacity = 'Capacity is required.';
    else if (cap <= 0) e.capacity = 'Capacity must be greater than 0.';
    if (!values.location.trim()) e.location = 'Location is required.';
    if (!values.status) e.status = 'Status is required.';
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, type: true, capacity: true, location: true, status: true });
    if (!isValid) return;

    onSubmit({
      name: values.name.trim(),
      type: values.type as ResourceType,
      capacity: Number(values.capacity),
      location: values.location.trim(),
      status: values.status as ResourceStatus,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{isEdit ? 'Update Resource' : 'Create Resource'}</h3>
          <p className="text-sm text-slate-500">
            {isEdit ? 'Edit the selected resource and save changes.' : 'Add a new campus resource for booking and tracking.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            onBlur={() => touch('name')}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              touched.name && errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
            placeholder="e.g. Lecture Hall A"
          />
          {touched.name && errors.name ? <p className="text-xs text-red-600 mt-1">{errors.name}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            value={values.type}
            onChange={(e) => setField('type', e.target.value)}
            onBlur={() => touch('type')}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 ${
              touched.type && errors.type
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {touched.type && errors.type ? <p className="text-xs text-red-600 mt-1">{errors.type}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
          <input
            value={values.capacity}
            onChange={(e) => setField('capacity', e.target.value)}
            onBlur={() => touch('capacity')}
            type="number"
            min={1}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              touched.capacity && errors.capacity
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
            placeholder="e.g. 40"
          />
          {touched.capacity && errors.capacity ? <p className="text-xs text-red-600 mt-1">{errors.capacity}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            value={values.location}
            onChange={(e) => setField('location', e.target.value)}
            onBlur={() => touch('location')}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              touched.location && errors.location
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
            placeholder="e.g. Block B, Floor 1"
          />
          {touched.location && errors.location ? <p className="text-xs text-red-600 mt-1">{errors.location}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            value={values.status}
            onChange={(e) => setField('status', e.target.value)}
            onBlur={() => touch('status')}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 ${
              touched.status && errors.status
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          {touched.status && errors.status ? <p className="text-xs text-red-600 mt-1">{errors.status}</p> : null}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 transition text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || !!submitting}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : isEdit ? 'Update Resource' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;

