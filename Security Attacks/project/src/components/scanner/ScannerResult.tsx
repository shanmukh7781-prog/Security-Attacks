import React from 'react';
import { motion } from 'framer-motion';
import { IpInfo } from '../../types/Scanner';
import { InfoItem } from '../ui/InfoItem';

interface ScannerResultProps {
  result: IpInfo;
}

export const ScannerResult: React.FC<ScannerResultProps> = ({ result }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0c0c14] rounded-lg p-4 border border-[#00fff2]/20"
  >
    <div className="grid grid-cols-2 gap-4">
      <InfoItem label="IP Address" value={result.ip} isMonospace />
      <InfoItem label="Location" value={`${result.city}, ${result.country_name}`} />
      <InfoItem label="ISP" value={result.org} />
      <InfoItem label="Region" value={result.region} />
    </div>
  </motion.div>
);