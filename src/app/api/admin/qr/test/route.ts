import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  try {
    // Check if any QR codes exist
    const { data: existingCodes, error: fetchError } = await supabase
      .from('qr_codes')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch', details: fetchError });
    }
    
    // If no codes exist, create a test one
    if (!existingCodes || existingCodes.length === 0) {
      const { data: newCode, error: insertError } = await supabase
        .from('qr_codes')
        .insert({
          code: 'CTEST1',
          category: 'C',
          base58_id: 'TEST1',
          name: 'Test QR Code',
          description: 'This is a test QR code',
          is_active: true,
        })
        .select()
        .single();
      
      if (insertError) {
        return NextResponse.json({ 
          message: 'No codes found, failed to create test code', 
          error: insertError 
        });
      }
      
      return NextResponse.json({ 
        message: 'Created test QR code',
        code: newCode 
      });
    }
    
    return NextResponse.json({ 
      message: 'Found existing QR codes',
      codes: existingCodes 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error });
  }
}