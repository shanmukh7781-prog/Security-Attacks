import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`
      px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors
      disabled:opacity-50
      ${variant === 'primary' 
        ? 'bg-[#00fff2] text-black hover:bg-[#00fff2]/90' 
        : 'bg-[#141420] text-[#00fff2] border border-[#00fff2]/20 hover:bg-[#1a1a2e]'}
      ${className}
    `}
    {...props}
  >
    {children}
  </motion.button>
);