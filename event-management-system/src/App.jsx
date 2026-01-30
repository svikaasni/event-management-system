import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import AuthPage from './pages/Auth';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import CheckInScanner from './pages/CheckInScanner';
import AttendeeDashboard from './pages/AttendeeDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden text-white font-sans">
          {/* Static Star Background since index.css handles animation via body, but we need the div hook if we used custom index.css logic */}
          <div className="stars"></div>

          <div className="relative z-10">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />

              <Route path="/organizer" element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/scan" element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <CheckInScanner />
                </ProtectedRoute>
              } />

              <Route path="/create-event" element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <CreateEvent />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/" element={
                <ProtectedRoute allowedRoles={['attendee']}>
                  {/* Redirects Organizers/Admins to their dashboards via ProtectedRoute logic */}
                  <AttendeeDashboard />
                </ProtectedRoute>
              } />

              <Route path="/event/:id" element={
                <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
                  <EventDetails />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <Toaster position="top-right" toastOptions={{
            style: {
              background: 'rgba(21, 23, 37, 0.9)',
              color: '#fff',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              backdropFilter: 'blur(10px)',
            }
          }} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
