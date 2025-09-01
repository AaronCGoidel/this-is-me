import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { executeAction, type ActionResult } from '@/lib/qr/actions';
import { recordScan } from '@/lib/qr/client';
import { useUser } from '@/contexts/UserContext';

export function useQRAction() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);

  const execute = useCallback(async (
    action: any,
    qrCodeId: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const actionResult = await executeAction(action, user?.id);
      setResult(actionResult);
      
      // Record the scan
      await recordScan(
        qrCodeId,
        user?.id,
        action.action_type,
        actionResult.success
      );
      
      // Handle different action types
      if (actionResult.success) {
        switch (actionResult.type) {
          case 'redirect':
            if (actionResult.data?.url) {
              if (actionResult.data.newTab) {
                window.open(actionResult.data.url, '_blank');
              } else {
                window.location.href = actionResult.data.url;
              }
            }
            break;
            
          case 'prompt':
            const prompt = encodeURIComponent(actionResult.data?.prompt || '');
            const autoExecute = actionResult.data?.autoExecute ? '1' : '0';
            router.push(`/?prompt=${prompt}&execute=${autoExecute}`);
            break;
            
          case 'wifi':
            if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
              const { ssid, password, security = 'WPA' } = actionResult.data || {};
              const wifiString = `WIFI:T:${security};S:${ssid};P:${password};;`;
              window.location.href = wifiString;
            }
            break;
            
          case 'api':
            // API calls are handled in the action executor
            break;
        }
      } else {
        setError(actionResult.error || 'Action failed');
      }
      
      return actionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute action';
      setError(errorMessage);
      return { success: false, type: 'error' as const, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  return {
    execute,
    loading,
    error,
    result,
  };
}