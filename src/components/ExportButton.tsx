import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToImage } from '@/utils/export';
import { toast } from 'sonner';

const ExportButton: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToImage('results-container');
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      size="lg"
      className="rounded-full gap-2"
    >
      <Download className="w-4 h-4" />
      {isExporting ? 'Exporting...' : 'Export as Image'}
    </Button>
  );
};

export default ExportButton;
