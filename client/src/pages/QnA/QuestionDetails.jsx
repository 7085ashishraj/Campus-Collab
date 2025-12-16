import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MessageCircle, Calendar, User, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const QuestionDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [question, setQuestion] = useState(null);
    const [newAnswer, setNewAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const fetchQuestion = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/questions/${id}`);
            setQuestion(data);
        } catch (error) {
            console.error("Error fetching question", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        if (!newAnswer.trim()) return;

        setSubmitting(true);
        try {
            const { data } = await axios.post(`http://localhost:5000/api/questions/${id}/answers`, {
                content: newAnswer
            }, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });

            // Add new answer to list
            setQuestion(prev => ({
                ...prev,
                answers: [...prev.answers, data]
            }));
            setNewAnswer('');
        } catch (error) {
            console.error("Error posting answer", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 pt-20 lg:pl-72 text-center">Loading...</div>;
    if (!question) return <div className="p-8 pt-20 lg:pl-72 text-center">Question not found</div>;

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8 pt-20 lg:pt-8 lg:pl-72">
            <div className="max-w-4xl mx-auto">
                <Link to="/questions" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Questions
                </Link>

                {/* Question */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                {question.author?.avatar ? (
                                    <img src={question.author.avatar} alt={question.author.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6 text-gray-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{question.author?.name}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(question.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {question.title}
                        </h1>

                        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-6">
                            {question.description.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            {question.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        {question.answers.length} Answers
                    </h2>

                    <div className="space-y-4">
                        {question.answers.map((answer) => (
                            <div key={answer._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                        {answer.author?.avatar ? (
                                            <img src={answer.author.avatar} alt={answer.author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900 dark:text-white">{answer.author?.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(answer.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    {answer.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Answer Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Answer</h3>
                    <form onSubmit={handleSubmitAnswer}>
                        <textarea
                            required
                            rows={4}
                            placeholder="Type your answer here..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 mb-4"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !newAnswer.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                Post Answer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetails;
