import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Connect. Collaborate. Create.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The ultimate hub for university students to find teammates, showcase projects, and build the future together.
            </p>
            <div className="space-x-4">
                <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
                    Join Now
                </Link>
                <Link to="/api/projects" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition">
                    Explore Projects
                </Link>
            </div>
        </div>
    );
};

export default Home;
