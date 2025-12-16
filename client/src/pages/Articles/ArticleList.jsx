import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Heart, Calendar, User } from 'lucide-react';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/articles');
            setArticles(data);
        } catch (error) {
            console.error("Error fetching articles", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8 pt-20 lg:pt-8 lg:pl-72">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Articles & Resources</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Share knowledge and learn from peers</p>
                </div>
                <Link
                    to="/articles/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Write Article
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <Link
                            key={article._id}
                            to={`/articles/${article._id}`}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {article.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                                {article.content}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                        {article.author?.avatar ? (
                                            <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {article.author?.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-500 text-xs">
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-4 h-4" /> {article.likes.length}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> {new Date(article.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticleList;
