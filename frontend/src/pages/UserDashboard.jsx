import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';
import { Clock, CheckCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await apiClient.get('/api/users');
      setComplaints(data);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const pending = complaints.filter(c => c.status === 'PENDING').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Complaints
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track and manage your maintenance requests.
          </p>
        </div>
        <Link to="/complaints/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Requests</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{complaints.length}</h3>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pending}</h3>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolved</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{resolved}</h3>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/50 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Complaints</h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-y border-slate-200 dark:border-slate-700/50">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 bg-white dark:bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading complaints...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No complaints found.</td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.title}</td>
                    <td className="px-6 py-4">{c.category}</td>
                    <td className="px-6 py-4"><Badge status={c.status} /></td>
                    <td className="px-6 py-4">{format(new Date(c.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <Link to={`/complaints/${c.id}`} className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        View Details
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
