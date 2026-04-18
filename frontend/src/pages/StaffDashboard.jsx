import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
    try {
      const data = await apiClient.get('/api/staff/complaints');
      setComplaints(data);
    } catch (err) {
      toast.error('Failed to load assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  const statusChange = async (id, status) => {
    try {
      await apiClient.patch(`/api/staff/complaints/${id}/status`, { status });
      toast.success('Status updated');
      fetchAssigned();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tasks Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your assigned maintenance tasks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Assignments</h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-y border-slate-200 dark:border-slate-700/50">
              <tr>
                <th className="px-6 py-3">Task ID</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Location/Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Assigned Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 bg-white dark:bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading tasks...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No active tasks.</td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{c.id.slice(0,8)}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.title}</td>
                    <td className="px-6 py-4">{c.category}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={c.status}
                        onChange={(e) => statusChange(c.id, e.target.value)}
                        className="text-xs font-semibold rounded-md border border-slate-300 bg-white px-2 py-1 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
                      >
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">{format(new Date(c.updated_at), 'MMM d, p')}</td>
                    <td className="px-6 py-4">
                      <Link to={`/complaints/${c.id}`} className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
