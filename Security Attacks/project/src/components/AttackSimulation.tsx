import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Wifi, Search, Database, Lock } from 'lucide-react';

interface AttackSimulationProps {
  ip: string;
  isActive: boolean;
  onComplete?: () => void;
}

const attacks = [
  { 
    name: 'Network Reconnaissance',
    duration: 3000,
    icon: Search,
    description: 'Scanning network topology and open ports...',
    details: ['Port scanning...', 'Service detection...', 'OS fingerprinting...']
  },
  { 
    name: 'Vulnerability Assessment',
    duration: 4000,
    icon: AlertTriangle,
    description: 'Analyzing system vulnerabilities...',
    details: ['CVE database check...', 'Security patch analysis...', 'Configuration audit...']
  },
  { 
    name: 'Service Enumeration',
    duration: 3500,
    icon: Database,
    description: 'Identifying running services...',
    details: ['Web services...', 'Database services...', 'Authentication services...']
  },
  { 
    name: 'Security Analysis',
    duration: 4500,
    icon: Lock,
    description: 'Performing security checks...',
    details: ['Firewall analysis...', 'IDS/IPS detection...', 'Security posture evaluation...']
  }
];

export const AttackSimulation: React.FC<AttackSimulationProps> = ({ ip, isActive, onComplete }) => {
  const [currentAttackIndex, setCurrentAttackIndex] = useState(-1);
  const [detailIndex, setDetailIndex] = useState(0);

  useEffect(() => {
    if (isActive && currentAttackIndex === -1) {
      setCurrentAttackIndex(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (currentAttackIndex >= 0 && currentAttackIndex < attacks.length) {
      const attack = attacks[currentAttackIndex];
      
      // Reset detail index for new attack
      setDetailIndex(0);
      
      // Cycle through details
      const detailInterval = setInterval(() => {
        setDetailIndex(prev => (prev + 1) % attack.details.length);
      }, attack.duration / 3);
      
      // Move to next attack
      const timer = setTimeout(() => {
        if (currentAttackIndex < attacks.length - 1) {
          setCurrentAttackIndex(prev => prev + 1);
        } else if (onComplete) {
          onComplete();
        }
      }, attack.duration);

      return () => {
        clearTimeout(timer);
        clearInterval(detailInterval);
      };
    }
  }, [currentAttackIndex, isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0c0c14] p-6 rounded-lg border border-[#00fff2]/20"
    >
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-[#00fff2]" />
        <h3 className="text-[#00fff2] font-bold text-lg">Attack Simulation</h3>
      </div>
      
      <div className="space-y-6">
        {attacks.map((attack, index) => {
          const Icon = attack.icon;
          const isActive = index === currentAttackIndex;
          const isComplete = index < currentAttackIndex;
          
          return (
            <motion.div
              key={attack.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: index <= currentAttackIndex ? 1 : 0.5,
                x: 0
              }}
              transition={{ delay: index * 0.2 }}
              className={`relative ${isComplete ? 'text-green-400' : 'text-gray-300'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#00fff2]' : ''}`} />
                <span className="font-semibold">{attack.name}</span>
                {isComplete && <CheckCircle className="w-4 h-4 text-green-400" />}
              </div>
              
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-8"
                >
                  <p className="text-[#00fff2] text-sm mb-2">{attack.description}</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={detailIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="font-mono text-sm text-gray-400"
                    >
                      {attack.details[detailIndex]}
                    </motion.div>
                  </AnimatePresence>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: attack.duration / 1000 }}
                    className="h-1 bg-[#00fff2]/20 rounded-full relative overflow-hidden mt-2"
                  >
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      transition={{ duration: attack.duration / 1000 }}
                      className="absolute inset-0 bg-[#00fff2]"
                    />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};