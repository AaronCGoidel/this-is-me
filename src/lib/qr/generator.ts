import { generateBase58 } from './base58';
import { QRCategory, isValidCategory } from './categories';
import { createClient } from '@/lib/supabase/server';

export interface GenerateQRCodesOptions {
  category: QRCategory;
  count: number;
  namePrefix?: string;
}

export interface GeneratedQRCode {
  code: string;
  category: QRCategory;
  base58_id: string;
  name?: string;
}

export async function generateQRCodes({
  category,
  count,
  namePrefix
}: GenerateQRCodesOptions): Promise<GeneratedQRCode[]> {
  if (!isValidCategory(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  const supabase = await createClient();
  
  // Get existing codes to avoid duplicates
  const { data: existingCodes } = await supabase
    .from('qr_codes')
    .select('code')
    .eq('category', category);
  
  const existingSet = new Set(existingCodes?.map(c => c.code) || []);
  
  const generated: GeneratedQRCode[] = [];
  
  for (let i = 0; i < count; i++) {
    let base58Id = generateBase58();
    let code = `${category}${base58Id}`;
    
    // Ensure unique
    let attempts = 0;
    while (existingSet.has(code) && attempts < 100) {
      base58Id = generateBase58();
      code = `${category}${base58Id}`;
      attempts++;
    }
    
    existingSet.add(code);
    
    generated.push({
      code,
      category,
      base58_id: base58Id,
      name: namePrefix ? `${namePrefix} ${i + 1}` : undefined
    });
  }
  
  return generated;
}

export async function saveGeneratedCodes(codes: GeneratedQRCode[]) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('qr_codes')
    .insert(codes)
    .select();
  
  if (error) {
    throw new Error(`Failed to save QR codes: ${error.message}`);
  }
  
  return data;
}

export function generateQRCodeURL(code: string, baseURL?: string): string {
  const base = baseURL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${base}/q/${code}`;
}

export function generateWiFiString(ssid: string, password: string, security: 'WPA' | 'WEP' | 'nopass' = 'WPA'): string {
  // WiFi QR code format: WIFI:T:WPA;S:network_name;P:password;;
  return `WIFI:T:${security};S:${ssid};P:${password};;`;
}