import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, MessageCircle, Calendar, User } from 'lucide-react';

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/questions');
            setQuestions(data);
        } catch (error) {
            console.error("Error fetching questions", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8 pt-20 lg:pt-8 lg:pl-72">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Q&A Forum</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Ask questions and help your peers</p>
                </div>
                <Link
                    to="/questions/ask"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Ask Question
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question) => (
                        <Link
                            key={question._id}
                            to={`/questions/${question._id}`}
                            className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {question.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                                        {question.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                {question.author?.avatar ? (
                                                    <img src={question.author.avatar} alt={question.author.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-3 h-3 text-gray-500" />
                                                )}
                                            </div>
                                            <span>{question.author?.name}</span>
                                        </div>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> {new Date(question.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            {question.tags.map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg min-w-[80px]">
                                    <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                        {question.answers.length}
                                    </span>
                                    <span className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Answers</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuestionList;
