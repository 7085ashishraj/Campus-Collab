import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatProvider';
import NotificationBell from './NotificationBell';
import ProfileModal from './ProfileModal';
import {
    LayoutDashboard,
    MessageSquare,
    PlusCircle,
    LogOut,
    GraduationCap,
    Settings,
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { notification } = useChat();
    const navigate = useNavigate();
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
        {
            to: "/chats",
            icon: <MessageSquare className="w-5 h-5" />,
            label: "Messages",
            badge: notification.length > 0 ? notification.length : null
        },
        { to: "/projects/new", icon: <PlusCircle className="w-5 h-5" />, label: "Create Project" },
    ];

    return (
        <>
            <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 hidden lg:flex flex-col transition-colors">
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">CampusCollab</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
                    {/* User Profile Card */}
                    <div className="px-4 mb-6">
                        <div
                            onClick={() => setShowProfileModal(true)}
                            className="p-3 bg-indigo-50 dark:bg-gray-700/50 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                alt={user?.name}
                                className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 truncate">
                                    {user?.university || 'Student'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    {item.label}
                                </div>
                                {item.badge && (
                                    <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none rounded-full ${item.to === location.pathname ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="px-4 mt-auto space-y-1">
                        <div className="px-3 py-2.5 flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                            <span>Notifications</span>
                            <NotificationBell />
                        </div>
                        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white w-full transition-colors">
                            <Settings className="w-5 h-5" />
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {showProfileModal && (
                <ProfileModal onClose={() => setShowProfileModal(false)} />
            )}
        </>
    );
};

export default Sidebar;
