import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import PrivateRoute from './components/PrivateRoute';
// AuthProvider imported from context

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create-project" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

