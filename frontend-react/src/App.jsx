import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Members from './pages/Members';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';
import Trainers from './pages/Trainers';
import Plans from './pages/Plans';
import { Toaster } from 'react-hot-toast';
import { Menu, X } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="d-flex position-relative">
      {/* Mobile Toggle Button */}
      <button 
        className="d-lg-none btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg z-index-2000"
        style={{ width: 60, height: 60, zIndex: 2000 }}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X /> : <Menu />}
      </button>

      {/* Sidebar with mobile state */}
      <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <Sidebar closeSidebar={() => setShowSidebar(false)} />
      </div>

      {/* Main Content */}
      <main className={`main-content flex-grow-1 ${showSidebar ? 'sidebar-open' : ''}`}>
        {/* Overlay for mobile when sidebar is open */}
        {showSidebar && (
            <div 
                className="position-fixed top-0 start-0 w-100 h-100 bg-black opacity-50 z-index-999 d-lg-none"
                onClick={() => setShowSidebar(false)}
                style={{ zIndex: 999 }}
            ></div>
        )}
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <ProtectedLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/trainers" element={<Trainers />} />
                  <Route path="/plans" element={<Plans />} />
                </Routes>
              </ProtectedLayout>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
