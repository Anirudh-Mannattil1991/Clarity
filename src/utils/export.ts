export const exportToImage = async (elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const dataUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = `clarity-${new Date().getTime()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};
