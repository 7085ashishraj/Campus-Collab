import React from 'react';

const stats = [
    { number: "500+", label: "Active Projects" },
    { number: "2k+", label: "Student Developers" },
    { number: "50+", label: "Universities" },
    { number: "98%", label: "Success Rate" }
];

const StatsSection = () => {
    return (
        <section id="stats" className="py-20 bg-indigo-600 dark:bg-indigo-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-6">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                            <div className="text-indigo-200 dark:text-indigo-300 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
