import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusSquare, Layout } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-blue-600">
                        CampusCollab
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-blue-600">
                                    <Layout className="w-5 h-5 mr-1" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link to="/create-project" className="flex items-center text-gray-700 hover:text-blue-600">
                                    <PlusSquare className="w-5 h-5 mr-1" />
                                    <span>New Project</span>
                                </Link>
                                <div className="flex items-center space-x-2 border-l pl-4 ml-4">
                                    <img
                                        src={user.avatar || "https://via.placeholder.com/32"}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-sm font-medium hidden md:block">{user.name}</span>
                                    <button onClick={logout} className="ml-2 text-gray-500 hover:text-red-500">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
