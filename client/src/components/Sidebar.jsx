import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Mail, BarChart2, FolderPlus, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/rfps", icon: FileText, label: "RFPs" },
    { to: "/inbox", icon: Mail, label: "Inbox" },
    { to: "/vendors", icon: Users, label: "Vendors" },
    { to: "/create", icon: FolderPlus, label: "Create RFP" },
  ];

  const activeClass = "flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 border-r-4 border-blue-600 transition-all";
  const inactiveClass = "flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all";

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <span className="text-lg">P</span>
            </div>
            Procure AI
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-md">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>


      </aside>
    </>
  );
};

export default Sidebar;
