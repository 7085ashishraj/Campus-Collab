import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, School, BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import Header from '../components/LandingPage/header';
import bgVideo from '../assets/bg.mp4';

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register: registerUser } = useAuth();

    // Determine initial state based on URL
    const [isSignUp, setIsSignUp] = useState(location.pathname === '/register');

    useEffect(() => {
        setIsSignUp(location.pathname === '/register');
    }, [location.pathname]);

    const toggleMode = () => {
        const newMode = !isSignUp;
        setIsSignUp(newMode);
        // Use navigate to update URL properly
        navigate(newMode ? '/register' : '/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            <Header transparent={true} />

            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={bgVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <div className={`relative bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden max-w-[1000px] w-full min-h-[600px] transition-all duration-700 ease-in-out z-10`}>

                {/* SIGN UP FORM (Left Side when Active) */}
                <div
                    className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 ${isSignUp ? 'opacity-100 z-20 translate-x-0' : 'opacity-0 z-10 translate-x-[20%]'}`}
                >
                    <RegisterForm isActive={isSignUp} registerUser={registerUser} navigate={navigate} toggleMode={toggleMode} />
                </div>

                {/* SIGN IN FORM (Right Side when Inactive) */}
                <div
                    className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 ${isSignUp ? 'opacity-0 z-10 translate-x-[-20%]' : 'opacity-100 z-20 translate-x-[100%]'}`}
                >
                    <LoginForm isActive={!isSignUp} login={login} navigate={navigate} toggleMode={toggleMode} />
                </div>

                {/* OVERLAY CONTAINER (The Sliding Image) */}
                <div
                    className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 ${isSignUp ? 'translate-x-0 rounded-l-[2rem]' : '-translate-x-full rounded-r-[2rem]'}`}
                    style={{ borderRadius: isSignUp ? '0 2rem 2rem 0' : '2rem 0 0 2rem' }} // Visually tricky, but keeping for now
                >
                    {/* Background Image Wrapper */}
                    <div
                        className={`relative w-full h-full bg-cover bg-center backdrop-blur-md border-l border-white/20 text-white transition-transform duration-700 ease-in-out`}
                        style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1703701579680-3b4c2761aa47?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
                    >
                        {/* Simplified: Image moves with the container. No internal shift to avoid gaps. */}

                        <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>

                        {/* Overlay Text Content */}
                        <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-12 transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-0' : 'translate-x-0'}`}>
                            <GraduationCap className="h-20 w-20 mb-6 text-indigo-200" />
                            <h1 className="text-4xl font-bold mb-4">
                                {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
                            </h1>
                            <p className="text-lg text-indigo-100 mb-8">
                                {isSignUp
                                    ? "To keep connected with us please login with your personal info"
                                    : "Enter your personal details and start your journey with us"}
                            </p>
                            <button
                                onClick={toggleMode}
                                className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-indigo-900 transition-colors uppercase tracking-wider"
                            >
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View Support (Hidden on Desktop) - If needed, but user asked for specific sliding UI which implies Desktop. 
                We can add a simple media query check to stack them on mobile if required later. 
                For now, sticking to the requested sliding UI which works best larger screens.
            */}
        </div>
    );
};

const LoginForm = ({ isActive, login, navigate, toggleMode }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full px-12 bg-transparent text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Sign in</h1>
            <div className="flex gap-4 mb-4">
                {/* Social Icons could go here */}
            </div>
            <span className="text-sm text-gray-200 mb-6">or use your email account</span>

            {serverError && (
                <div className="mb-4 w-full bg-red-500/20 text-red-200 px-4 py-2 rounded text-sm backdrop-blur-sm border border-red-500/30">
                    {serverError}
                </div>
            )}

            <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                        {...register('email', { required: 'Email is required' })}
                        type="email"
                        placeholder="Email"
                        className="w-full pl-10 px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm transition-all"
                    />
                    {errors.email && <p className="text-xs text-red-300 text-left mt-1">{errors.email.message}</p>}
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                        {...register('password', { required: 'Password is required' })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="w-full pl-10 pr-10 px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {errors.password && <p className="text-xs text-red-300 text-left mt-1">{errors.password.message}</p>}
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-indigo-600/90 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors uppercase tracking-wider mt-4 flex justify-center backdrop-blur-sm shadow-lg"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                </button>
            </form>

            {/* Mobile Toggle */}
            <div className="mt-6 lg:hidden">
                <button onClick={toggleMode} className="text-indigo-400 font-semibold hover:text-indigo-300">
                    Don't have an account? Sign Up
                </button>
            </div>
        </div>
    );
};

const RegisterForm = ({ isActive, registerUser, navigate, toggleMode }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');
        try {
            const formattedData = {
                ...data,
                skills: data.skills ? data.skills.split(',').map(s => s.trim()) : []
            };
            await registerUser(formattedData);
            navigate('/dashboard');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full px-12 bg-transparent text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Create Account</h1>
            <span className="text-sm text-gray-200 mb-6">use your email for registration</span>

            {serverError && (
                <div className="mb-4 w-full bg-red-500/20 text-red-200 px-4 py-2 rounded text-sm backdrop-blur-sm border border-red-500/30">
                    {serverError}
                </div>
            )}

            <form className="w-full space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-300" />
                    <input {...register('name', { required: true })} type="text" placeholder="Name" className="w-full pl-10 px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-gray-300 rounded-lg backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-300" />
                    <input {...register('email', { required: true })} type="email" placeholder="Email" className="w-full pl-10 px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-gray-300 rounded-lg backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-300" />
                    <input
                        {...register('password', { required: true })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="w-full pl-10 pr-10 px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-gray-300 rounded-lg backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-300 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>

                <div className="relative">
                    <School className="absolute left-3 top-3.5 h-5 w-5 text-gray-300" />
                    <input {...register('university', { required: true })} type="text" placeholder="University" className="w-full pl-10 px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-gray-300 rounded-lg backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                </div>

                <div className="relative">
                    <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-300" />
                    <input {...register('skills')} type="text" placeholder="Skills (comma separated)" className="w-full pl-10 px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-gray-300 rounded-lg backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-indigo-600/90 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors uppercase tracking-wider mt-2 flex justify-center backdrop-blur-sm shadow-lg"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                </button>
            </form>

            {/* Mobile Toggle */}
            <div className="mt-4 lg:hidden">
                <button onClick={toggleMode} className="text-indigo-400 font-semibold hover:text-indigo-300">
                    Already have an account? Sign In
                </button>
            </div>
        </div>
    );
};

export default AuthPage;
