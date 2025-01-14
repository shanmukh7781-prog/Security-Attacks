import React, { useState, useEffect } from 'react';
import { resolveDomain } from '../utils/dns';
import { ScannerForm } from './scanner/ScannerForm';
import { ScannerResult } from './scanner/ScannerResult';
import { ErrorMessage } from './ui/ErrorMessage';
import { Button } from './ui/Button';
import { RefreshCw, Save, Globe } from 'lucide-react';
import type { IpInfo, ScanHistory } from '../types/Scanner';
import { GlobeView } from './GlobeView';
import { AttackSimulation } from './AttackSimulation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export const DomainScanner: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);
  const [showAttackSim, setShowAttackSim] = useState(false);
  const [attackLines, setAttackLines] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const generateAttackLines = (targetLat: number, targetLng: number) => {
    const attackPoints = [
      { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
      { lat: 40.7128, lng: -74.0060, name: 'New York' },
      { lat: 51.5074, lng: -0.1278, name: 'London' },
      { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
      { lat: -33.8688, lng: 151.2093, name: 'Sydney' }
    ];

    return attackPoints.map(point => ({
      startLat: point.lat,
      startLng: point.lng,
      endLat: targetLat,
      endLng: targetLng,
      color: '#00fff2'
    }));
  };

  const scanDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setLoading(true);
    setError('');
    setShowAttackSim(false);
    setTargetCoords(null);
    setAttackLines([]);
    setShowResults(false);
    
    try {
      const ip = await resolveDomain(domain);
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      if (response.data.error) {
        throw new Error(response.data.reason || 'Failed to fetch IP info');
      }
      const newResult = response.data;
      setResult(newResult);
      
      // Set coordinates for the globe
      setTargetCoords([parseFloat(newResult.latitude), parseFloat(newResult.longitude)]);
      setAttackLines(generateAttackLines(parseFloat(newResult.latitude), parseFloat(newResult.longitude)));
      
      // Start attack simulation after globe animation sequence
      setTimeout(() => {
        setShowAttackSim(true);
      }, 12000); // Increased delay to account for longer globe animation
      
      // Add to scan history
      const timestamp = new Date().toISOString();
      setHistory(prev => [...prev, { domain, ip, timestamp, result: newResult }]);
    } catch (error) {
      setError('Failed to fetch domain information. Please try again.');
      setResult(null);
    }
    setLoading(false);
  };

  const onAttackComplete = () => {
    setShowResults(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        className="bg-[#141420] rounded-lg p-6 neon-border mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ScannerForm
          domain={domain}
          loading={loading}
          onDomainChange={setDomain}
          onSubmit={scanDomain}
        />

        {error && <ErrorMessage message={error} />}
        
        <AnimatePresence mode="wait">
          {targetCoords && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <GlobeView targetCoords={targetCoords} attackLines={attackLines} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAttackSim && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <AttackSimulation 
                ip={result.ip} 
                isActive={showAttackSim} 
                onComplete={onAttackComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResults && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <ScannerResult result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#141420] rounded-lg p-6 neon-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#00fff2] text-lg">Scan History</h3>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setHistory([])}>
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </Button>
                <Button variant="secondary" onClick={() => {
                  const dataStr = JSON.stringify(history, null, 2);
                  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                  const link = document.createElement('a');
                  link.href = dataUri;
                  link.download = 'scan-history.json';
                  link.click();
                }}>
                  <Save className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((scan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#0c0c14] p-3 rounded border border-[#00fff2]/10 text-sm"
                >
                  <div className="flex justify-between text-[#00fff2]">
                    <span>{scan.domain}</span>
                    <span>{new Date(scan.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-gray-400 mt-1">IP: {scan.ip}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};