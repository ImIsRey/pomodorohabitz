
import React from 'react';

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3 3v18h18V3H3zm16.5 16.5h-3V15h3v4.5zm0-6h-3v-3h3v3zm0-4.5h-3v-3h3v3zm-4.5 9h-3V12h3v7.5zm0-9h-3V6h3v4.5zm-4.5 9h-3V9h3v10.5z" />
    </svg>
);

export default ChartBarIcon;
