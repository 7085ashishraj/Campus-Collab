import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Login to CampusCollab</h2>
            {serverError && <div className="text-red-500 mb-4 text-center">{serverError}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
            </p>
        </div>
    );
};

export default Login;
