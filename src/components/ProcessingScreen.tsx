import React, { useEffect, useState } from 'react';

const messages = [
  'Analyzing your thoughts…',
  'Finding what matters most…',
  'Organizing your priorities…',
  'Creating clarity…'
];

const ProcessingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>

        <div className="space-y-2">
          <p className="text-xl md:text-2xl font-medium text-foreground animate-pulse">
            {messages[messageIndex]}
          </p>
          <p className="text-sm text-muted-foreground">
            This usually takes less than 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
