import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-red-400 mb-4 p-3 bg-red-500/10 rounded-lg flex items-center gap-2"
  >
    <AlertCircle className="w-5 h-5" />
    {message}
  </motion.div>
);