import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Heart, Calendar, User, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ArticleDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/articles/${id}`);
            setArticle(data);
        } catch (error) {
            console.error("Error fetching article", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const { data } = await axios.put(`http://localhost:5000/api/articles/${id}/like`, {}, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            setArticle(prev => ({ ...prev, likes: data }));
        } catch (error) {
            console.error("Error liking article", error);
        }
    };

    if (loading) return <div className="p-8 pt-20 lg:pl-72 text-center">Loading...</div>;
    if (!article) return <div className="p-8 pt-20 lg:pl-72 text-center">Article not found</div>;

    const isLiked = user && article.likes.includes(user._id);

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8 pt-20 lg:pt-8 lg:pl-72">
            <div className="max-w-4xl mx-auto">
                <Link to="/articles" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Articles
                </Link>

                <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                {article.author?.avatar ? (
                                    <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6 text-gray-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{article.author?.name}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            {article.title}
                        </h1>

                        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                            {article.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center gap-2">
                            {article.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{article.likes.length} Likes</span>
                        </button>

                        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                            <Share2 className="w-5 h-5" />
                            Share
                        </button>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default ArticleDetails;
