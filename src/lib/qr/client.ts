import { createClient } from '@/lib/supabase/client';
import { QRAction } from './actions';

export interface QRCode {
  id: number;
  code: string;
  category: string;
  base58_id: string;
  name?: string;
  description?: string;
  is_active: boolean;
  scan_count: number;
  last_scanned_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface QRCodeWithActions extends QRCode {
  qr_actions: QRAction[];
}

export async function getQRCodeByCode(code: string): Promise<QRCodeWithActions | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('qr_codes')
    .select(`
      *,
      qr_actions (*)
    `)
    .eq('code', code)
    .eq('is_active', true)
    .single();
  
  if (error || !data) {
    console.error('Error fetching QR code:', error);
    return null;
  }
  
  return data as QRCodeWithActions;
}

export async function recordScan(
  qrCodeId: number,
  userId?: string,
  actionTaken?: string,
  success: boolean = true
): Promise<void> {
  const supabase = createClient();
  
  // Record the scan
  await supabase.from('qr_scans').insert({
    qr_code_id: qrCodeId,
    user_id: userId,
    action_taken: actionTaken,
    success,
    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
  });
  
  // Update scan count and last scanned timestamp
  await supabase
    .from('qr_codes')
    .update({
      scan_count: supabase.sql`scan_count + 1`,
      last_scanned_at: new Date().toISOString(),
    })
    .eq('id', qrCodeId);
}

export async function getCatalogueItem(qrCodeId: number) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('catalogue_items')
    .select('*')
    .eq('qr_code_id', qrCodeId)
    .single();
  
  if (error) {
    console.error('Error fetching catalogue item:', error);
    return null;
  }
  
  return data;
}