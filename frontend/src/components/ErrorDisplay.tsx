import React from 'react';
import { AlertCircle, WifiOff, Clock, Ban, AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  status?: number;
}

export function ErrorDisplay({ error, status }: ErrorDisplayProps) {
  const getErrorIcon = () => {
    switch (status) {
      case 401:
        return <Ban className="w-5 h-5" />;
      case 429:
        return <Clock className="w-5 h-5" />;
      case 503:
      case 504:
        return <AlertTriangle className="w-5 h-5" />;
      case 500:
        return <WifiOff className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getErrorClass = () => {
    switch (status) {
      case 401:
        return 'bg-purple-50 text-purple-600';
      case 429:
        return 'bg-yellow-50 text-yellow-600';
      case 503:
      case 504:
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-red-50 text-red-600';
    }
  };

  return (
    <div className={`p-4 rounded-lg flex items-center gap-3 ${getErrorClass()}`}>
      {getErrorIcon()}
      <span>{error}</span>
    </div>
  );
} 