import React from 'react';
import StatusBadge from './StatusBadge';
import type { Resource } from '../services/resourceService';

const ResourceTable: React.FC<{
  resources: Resource[];
  isAdmin: boolean;
  onEdit?: (r: Resource) => void;
  onDelete?: (r: Resource) => void;
  loading?: boolean;
}> = ({ resources, isAdmin, onEdit, onDelete, loading }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-700">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Capacity</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              {isAdmin ? <th className="px-4 py-3 font-semibold text-right">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={isAdmin ? 6 : 5}>
                  Loading resources…
                </td>
              </tr>
            ) : resources?.length ? (
              resources.map((r) => (
                <tr key={String(r.id ?? `${r.name}-${r.location}`)} className="text-sm">
                  <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td>
                  <td className="px-4 py-3 text-slate-700">{r.type}</td>
                  <td className="px-4 py-3 text-slate-700">{r.capacity}</td>
                  <td className="px-4 py-3 text-slate-700">{r.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  {isAdmin ? (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(r)}
                          className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(r)}
                          className="px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition text-xs font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={isAdmin ? 6 : 5}>
                  No resources found. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;

