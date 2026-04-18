import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'HOSTEL', label: 'Hostel' },
  { value: 'CLASSROOM', label: 'Classroom' },
  { value: 'INTERNET', label: 'Internet/WiFi' },
  { value: 'SANITATION', label: 'Sanitation' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'OTHER', label: 'Other' },
];

export default function NewComplaint() {
  const [formData, setFormData] = useState({ title: '', category: '', description: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      if (file) {
        data.append('image', file);
      }

      await apiClient.post('/api/users', data);
      toast.success('Complaint submitted successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Raise a Complaint
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Provide details about the issue.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. WiFi not working in Room 101"
            />
            
            <Select
              label="Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={CATEGORIES}
            />

            <div className="w-full">
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                required
                rows={4}
                className="input-field resize-none rounded-lg"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe the issue in detail..."
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Attachment (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-blue-400"
              />
              <p className="mt-1 text-xs text-slate-500">JPG, PNG up to 5MB</p>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
