import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Network, Key, Scan, Wifi } from 'lucide-react';
import { Attack } from '../types/Attack';

const icons = {
  database: Database,
  network: Network,
  key: Key,
  scan: Scan,
  wifi: Wifi,
};

interface AttackCardProps {
  attack: Attack;
  index: number;
}

export const AttackCard: React.FC<AttackCardProps> = ({ attack, index }) => {
  const Icon = icons[attack.icon as keyof typeof icons] || Terminal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#141420] rounded-lg p-6 hover:bg-[#1a1a2e] transition-colors border border-[#00fff2]/20 hover:border-[#00fff2]/40"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-[#00fff2]/10 rounded-lg">
          <Icon className="w-6 h-6 text-[#00fff2]" />
        </div>
        <h3 className="text-xl font-bold text-[#00fff2] neon-text">{attack.name}</h3>
      </div>
      <p className="text-gray-300 mb-4">{attack.description}</p>
      <div className="bg-[#0c0c14] rounded-lg p-4 font-mono text-sm border border-[#00fff2]/10">
        <p className="terminal-text mb-2">$ {attack.command}</p>
        <pre className="text-gray-400 whitespace-pre-wrap">{attack.output}</pre>
      </div>
    </motion.div>
  );
};