import React, { useState, useEffect } from 'react';

const Loading: React.FC = () => {
    const [text, setText] = useState('');
    const fullText = '> System.loading_resources...';

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText((prev) => prev + fullText.charAt(index));
            index++;
            if (index >= fullText.length) {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[200px] font-mono text-cyber-green text-xl">
            {text}
            <span className="animate-pulse">_</span>
        </div>
    );
};

export default Loading;
