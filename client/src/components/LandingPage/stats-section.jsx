import React, { useState, useEffect, useRef } from 'react';

const CountUp = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) { // Trigger if visible and not yet animated
                    setHasAnimated(true);
                    observer.disconnect(); // Stop observing once triggered
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [hasAnimated]);

    useEffect(() => {
        if (!hasAnimated) return;

        let startTime = null;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Ease out quart: 1 - (1 - x)^4
            const easeOut = 1 - Math.pow(1 - percentage, 4);

            setCount(Math.floor(end * easeOut));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, hasAnimated]);

    return (
        <span ref={elementRef} className="inline-block min-w-[3ch]">
            {count}{suffix}
        </span>
    );
};

const stats = [
    { value: 500, suffix: "+", label: "Active Projects" },
    { value: 2000, suffix: "+", label: "Student Developers" },
    { value: 50, suffix: "+", label: "Universities" },
    { value: 98, suffix: "%", label: "Success Rate" }
];

const StatsSection = () => {
    return (
        <section id="stats" className="py-20 bg-indigo-600 dark:bg-indigo-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-6">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                <CountUp end={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-indigo-200 dark:text-indigo-300 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
