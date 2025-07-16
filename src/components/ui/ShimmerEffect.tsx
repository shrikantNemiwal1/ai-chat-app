import React from 'react';

const ShimmerEffect: React.FC = () => {
  return (
    <div className="message incoming loading p-4 rounded-2xl bg-none text-[var(--text-color)] rounded-bl-lg max-w-md border-none">
      <div className="message-content flex items-center gap-4 w-full">
        <div className="avatar w-10 h-10 rounded-full flex-shrink-0  flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)"/>
            <defs>
              <radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)">
                <stop offset=".067" stopColor="#9168C0"/>
                <stop offset=".343" stopColor="#5684D1"/>
                <stop offset=".672" stopColor="#1BA1E3"/>
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="loading-indicator flex flex-col gap-3 w-full">
          <div className="loading-bar h-3 rounded-full bg-[var(--secondary-hover-color)] animate-pulse"></div>
          <div className="loading-bar h-3 rounded-full bg-[var(--secondary-hover-color)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="loading-bar h-3 rounded-full bg-[var(--secondary-hover-color)] w-4/5 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerEffect;
