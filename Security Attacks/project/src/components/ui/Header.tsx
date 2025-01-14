import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export const Header: React.FC = () => (
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex items-center justify-center gap-4 mb-12 pt-8"
  >
    <div className="relative">
      <Terminal className="w-12 h-12 text-[#00fff2] relative z-10" />
      <div className="absolute inset-0 bg-[#00fff2] blur-lg opacity-20"></div>
    </div>
    <h1 className="text-4xl font-bold text-[#00fff2] neon-text">CyberSec Arsenal</h1>
  </motion.div>
);