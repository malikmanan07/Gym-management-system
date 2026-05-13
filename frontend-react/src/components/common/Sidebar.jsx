import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  UserSquare2, 
  Dumbbell,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ closeSidebar }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Trainers', path: '/trainers', icon: UserSquare2 },
    { name: 'Workout & Diet', path: '/plans', icon: Dumbbell },
  ];

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex align-items-center mb-5 gap-3">
        <div className="logo-box bg-primary p-2 rounded-3 shadow-sm">
          <Dumbbell size={24} color="#FFF" />
        </div>
        <h3 className="m-0 fw-bold tracking-wider" style={{ color: '#2D3436' }}>
            FLEX<span className="text-primary">GYM</span>
        </h3>
      </div>

      <div className="nav flex-column gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) => 
              `nav-link d-flex align-items-center gap-3 py-3 px-4 rounded-3 transition-all ${
                isActive ? 'active shadow-sm' : 'text-secondary hover-bg-surface'
              }`
            }
          >
            <item.icon size={20} />
            <span className="fw-semibold">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto pt-5 border-top border-light">
        <div className="d-flex align-items-center gap-3 mb-4 px-2">
          <div className="avatar-circle bg-light text-primary fw-bold d-flex align-items-center justify-content-center shadow-sm" style={{width: 44, height: 44, borderRadius: '12px'}}>
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="m-0 fw-bold text-dark text-truncate small">{user?.fullName}</p>
            <small className="text-secondary text-uppercase fw-bold" style={{fontSize: '0.6rem'}}>{user?.role}</small>
          </div>
        </div>
        <button 
          onClick={logout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold"
          style={{ borderRadius: '8px' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
