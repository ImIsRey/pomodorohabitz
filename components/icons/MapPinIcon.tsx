
import React from 'react';

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a2.25 2.25 0 001.286-2.083V18.375a3.75 3.75 0 00-2.25-3.465l-2.086-.835A4.5 4.5 0 016 9.75V6.75a4.5 4.5 0 014.5-4.5h3a4.5 4.5 0 014.5 4.5v3a4.5 4.5 0 01-2.116 3.884l-2.086.835a3.75 3.75 0 00-2.25 3.465v1.928a2.25 2.25 0 001.286 2.083z" clipRule="evenodd" />
    </svg>
);

export default MapPinIcon;
