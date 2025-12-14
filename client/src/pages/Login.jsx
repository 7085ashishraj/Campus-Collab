import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex transition-colors">
            {/* Left Side - Image/Deco */}
            <div className="hidden lg:block lg:w-1/2 relative bg-indigo-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700 opacity-90"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-12 z-10 text-center">
                    <GraduationCap className="h-24 w-24 mb-8 text-indigo-200" />
                    <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
                    <p className="text-xl text-indigo-100 max-w-md">
                        Connect, collaborate, and create with fellow students on CampusCollab.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-md w-full mx-auto">
                    <div className="text-center lg:text-left">
                        <div className="flex justify-center lg:justify-start mb-6 lg:hidden">
                            <Link to="/" className="flex items-center gap-2">
                                <GraduationCap className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                            </Link>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign in to account</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                                Create one for free
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        {serverError && (
                            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {serverError}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                                        })}
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 transition-colors"
                                        placeholder="you@university.edu"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                    <a href="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('password', { required: 'Password is required' })}
                                        type="password"
                                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
