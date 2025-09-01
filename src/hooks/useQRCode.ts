import { useState, useEffect } from 'react';
import { getQRCodeByCode, type QRCodeWithActions } from '@/lib/qr/client';

export function useQRCode(code: string) {
  const [qrCode, setQRCode] = useState<QRCodeWithActions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('No QR code provided');
      setLoading(false);
      return;
    }

    const fetchQRCode = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getQRCodeByCode(code);
        
        if (!data) {
          setError('QR code not found');
        } else {
          setQRCode(data);
        }
      } catch (err) {
        console.error('Error fetching QR code:', err);
        setError('Failed to load QR code');
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [code]);

  return { qrCode, loading, error };
}