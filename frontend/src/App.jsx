import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NewComplaint from './pages/NewComplaint';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* USER routes */}
      <Route element={<DashboardLayout allowedRoles={['USER']} />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/complaints/new" element={<NewComplaint />} />
        {/* Placeholder for Details */}
        <Route path="/complaints/:id" element={<div className="p-4">Complaint Details</div>} />
      </Route>

      {/* STAFF routes */}
      <Route element={<DashboardLayout allowedRoles={['STAFF']} />}>
        <Route path="/staff" element={<StaffDashboard />} />
        {/* other staff routes will go here */}
      </Route>

      {/* ADMIN routes */}
      <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        {/* other admin routes will go here */}
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;