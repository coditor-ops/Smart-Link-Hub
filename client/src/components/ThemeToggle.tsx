import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-[#00ff41] bg-black/20 hover:bg-[#00ff41]/20 transition-all duration-300 group"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                <Sun
                    size={24}
                    className={`absolute inset-0 text-[#00ff41] transition-all duration-500 transform ${theme === 'light' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
                        }`}
                />
                <Moon
                    size={24}
                    className={`absolute inset-0 text-[#00ff41] transition-all duration-500 transform ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
