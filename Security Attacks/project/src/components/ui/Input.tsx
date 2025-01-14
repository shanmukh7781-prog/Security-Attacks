import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ icon, className = '', ...props }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {icon}
      </div>
    )}
    <input
      className={`
        w-full bg-[#0c0c14] text-white rounded-lg
        focus:ring-2 focus:ring-[#00fff2] outline-none
        border border-[#00fff2]/20
        ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3
        ${className}
      `}
      {...props}
    />
  </div>
);