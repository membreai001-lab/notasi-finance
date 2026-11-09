import React from 'react';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/90 text-white text-xs font-medium shadow-lg backdrop-blur-xs">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Mode Offline — Data tersimpan lokal</span>
    </div>
  );
};
