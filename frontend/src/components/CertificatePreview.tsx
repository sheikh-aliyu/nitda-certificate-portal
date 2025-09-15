import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

interface CertificatePreviewProps {
  certificateId: string;
}

const CertificatePreview = ({ certificateId }: CertificatePreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPdf = async () => {
    setLoading(true);
    try {
      const blob = await api.downloadCertificate(certificateId);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to load PDF preview', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pdfUrl) {
      return () => {
        URL.revokeObjectURL(pdfUrl);
      };
    }
  }, [pdfUrl]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={loadPdf}>
          {loading ? 'Loading...' : 'Preview'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-5/6">
        <DialogHeader>
          <DialogTitle>Certificate Preview</DialogTitle>
        </DialogHeader>
        <div className="h-full">
          {pdfUrl ? (
            <iframe src={pdfUrl} width="100%" height="100%" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Loading preview...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificatePreview;
