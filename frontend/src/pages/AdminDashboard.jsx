import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, analyticsRes] = await Promise.all([
        apiClient.get('/api/metrics/summary'),
        apiClient.get('/api/admin/analytics')
      ]);
      setMetrics(metricsRes);
      setAnalytics(analyticsRes);
    } catch (err) {
      toast.error('Failed to load admin data');
    }
  };

  if (!metrics || !analytics) return <div className="p-8 text-center">Loading dashboards...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">System overview and analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Total</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Complaints</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.total}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">API Error Rate</p>
            <h3 className="text-2xl font-bold text-red-600">{metrics.historicalErrorRate}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">P95 Latency</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.p95LatencyMs}ms</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Complaints by Category</h2>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.byCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Complaints by Status</h2>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.byStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
