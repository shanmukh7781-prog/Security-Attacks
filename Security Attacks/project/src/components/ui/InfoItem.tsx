import React from 'react';

interface InfoItemProps {
  label: string;
  value: string;
  isMonospace?: boolean;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value, isMonospace }) => (
  <div className="space-y-2">
    <p className="text-[#00fff2]">{label}</p>
    <p className={`text-white ${isMonospace ? 'font-mono' : ''}`}>{value}</p>
  </div>
);