import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import ArticleList from './pages/Articles/ArticleList';
import CreateArticle from './pages/Articles/CreateArticle';
import ArticleDetails from './pages/Articles/ArticleDetails';
import QuestionList from './pages/QnA/QuestionList';
import AskQuestion from './pages/QnA/AskQuestion';
import QuestionDetails from './pages/QnA/QuestionDetails';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chats" element={<ChatPage />} />
                    <Route path="/projects/new" element={<CreateProject />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/articles" element={<ArticleList />} />
                    <Route path="/articles/new" element={<CreateArticle />} />
                    <Route path="/articles/:id" element={<ArticleDetails />} />
                    <Route path="/questions" element={<QuestionList />} />
                    <Route path="/questions/ask" element={<AskQuestion />} />
                    <Route path="/questions/:id" element={<QuestionDetails />} />
                </Route>
            </Routes>
            <ToastContainer position="bottom-right" />
        </>
    );
}

export default App;
