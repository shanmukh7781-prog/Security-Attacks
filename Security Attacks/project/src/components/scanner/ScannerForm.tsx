import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ScannerFormProps {
  domain: string;
  loading: boolean;
  onDomainChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ScannerForm: React.FC<ScannerFormProps> = ({
  domain,
  loading,
  onDomainChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="flex gap-4 mb-6">
    <div className="flex-1">
      <Input
        icon={<Globe className="text-[#00fff2]" />}
        value={domain}
        onChange={(e) => onDomainChange(e.target.value)}
        placeholder="Enter domain name (e.g., google.com)..."
      />
    </div>
    <Button type="submit" disabled={loading || !domain}>
      <Search className="w-5 h-5" />
      {loading ? 'Scanning...' : 'Scan'}
    </Button>
  </form>
);