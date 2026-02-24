import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface EncouragementBannerProps {
  message: string;
}

const EncouragementBanner: React.FC<EncouragementBannerProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-4 border border-primary/20">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <p className="text-sm md:text-base font-medium text-foreground text-center">
            {message}
          </p>
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default EncouragementBanner;
