import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wind } from 'lucide-react';

const BreathReset: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathCount(0);

    const breathCycle = () => {
      if (breathCount < 3) {
        setBreathCount(prev => prev + 1);
        setTimeout(breathCycle, 6000); // 6 seconds per breath
      } else {
        setIsBreathing(false);
      }
    };

    breathCycle();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setBreathCount(0);
    setIsBreathing(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="rounded-full gap-2 text-muted-foreground hover:text-primary"
      >
        <Wind className="w-4 h-4" />
        Pause with me
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl gradient-text">
              3-Breath Reset
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 space-y-6">
            {!isBreathing && breathCount === 0 && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Take a moment to center yourself with three slow, intentional breaths.
                </p>
                <Button onClick={startBreathing} className="rounded-full">
                  Begin
                </Button>
              </div>
            )}

            {isBreathing && (
              <div className="text-center space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wind className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">
                    Breath {breathCount} of 3
                  </p>
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Breathe in slowly... and out...
                  </p>
                </div>
              </div>
            )}

            {!isBreathing && breathCount === 3 && (
              <div className="text-center space-y-4">
                <p className="text-lg font-medium text-primary">
                  Well done. 🌿
                </p>
                <p className="text-sm text-muted-foreground">
                  Now, name one thing fully in your control today:
                </p>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm italic text-foreground">
                    "I can choose my next small step."
                  </p>
                </div>
                <Button onClick={() => setIsOpen(false)} className="rounded-full">
                  Continue
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BreathReset;
