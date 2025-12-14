import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import ChatPage from './pages/ChatPage';
import AuthLayout from './components/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chats" element={<ChatPage />} />
                    <Route path="/projects/new" element={<CreateProject />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                </Route>
            </Routes>
            <ToastContainer position="bottom-right" />
        </>
    );
}

export default App;
