import React, { useEffect, useMemo, useState } from 'react';
import type { ResourceFilters as Filters, ResourceStatus, ResourceType } from '../services/resourceService';

const RESOURCE_TYPES: Array<ResourceType | ''> = ['', 'ROOM', 'LAB', 'EQUIPMENT'];
const RESOURCE_STATUSES: Array<ResourceStatus | ''> = ['', 'ACTIVE', 'OUT_OF_SERVICE'];

/**
 * Filtering logic:
 * - local form state
 * - debounced propagation to parent so the table updates dynamically
 */
const ResourceFilters: React.FC<{
  value: Filters;
  onChange: (next: Filters) => void;
  onClear?: () => void;
}> = ({ value, onChange, onClear }) => {
  const initial = useMemo(
    () => ({
      type: value?.type ?? '',
      capacity: typeof value?.capacity === 'number' ? String(value.capacity) : '',
      location: value?.location ?? '',
      status: value?.status ?? '',
    }),
    [value]
  );

  const [type, setType] = useState<string>(initial.type);
  const [capacity, setCapacity] = useState<string>(initial.capacity);
  const [location, setLocation] = useState<string>(initial.location);
  const [status, setStatus] = useState<string>(initial.status);
  const [capacityError, setCapacityError] = useState<string>('');

  useEffect(() => {
    setType(initial.type);
    setCapacity(initial.capacity);
    setLocation(initial.location);
    setStatus(initial.status);
    setCapacityError('');
  }, [initial.type, initial.capacity, initial.location, initial.status]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (capacityError) return;

      const capNum = capacity.trim() ? Number(capacity) : undefined;

      onChange({
        type: (type || undefined) as Filters['type'],
        status: (status || undefined) as Filters['status'],
        location: location.trim() ? location.trim() : undefined,
        capacity: typeof capNum === 'number' && !Number.isNaN(capNum) ? capNum : undefined,
      });
    }, 250);

    return () => window.clearTimeout(t);
  }, [type, capacity, location, status, capacityError, onChange]);

  const handleCapacity = (val: string) => {
    setCapacity(val);
    if (!val.trim()) {
      setCapacityError('');
      return;
    }
    const n = Number(val);
    if (Number.isNaN(n) || n < 0) setCapacityError('Minimum capacity must be a number ≥ 0');
    else setCapacityError('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t || 'ALL'} value={t}>
                  {t ? t : 'All'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Minimum capacity</label>
            <input
              value={capacity}
              onChange={(e) => handleCapacity(e.target.value)}
              type="number"
              min={0}
              placeholder="e.g. 30"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 ${
                capacityError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {capacityError ? <p className="text-xs text-red-600 mt-1">{capacityError}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Block A"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              {RESOURCE_STATUSES.map((s) => (
                <option key={s || 'ALL'} value={s}>
                  {s ? s.replace(/_/g, ' ') : 'All'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setType('');
              setCapacity('');
              setLocation('');
              setStatus('');
              setCapacityError('');
              onClear?.();
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 transition text-sm font-semibold"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceFilters;

