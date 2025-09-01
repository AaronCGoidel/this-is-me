import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const resolvedParams = await params;
  const { code } = resolvedParams;
  
  const supabase = await createClient();
  
  // Check admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Try exact match
    const { data: exactMatch, error: exactError } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('code', code)
      .single();
    
    // Try case-insensitive
    const { data: allMatches } = await supabase
      .from('qr_codes')
      .select('*')
      .ilike('code', code);
    
    // Get all codes with similar pattern
    const { data: similarCodes } = await supabase
      .from('qr_codes')
      .select('code, category, base58_id, is_active')
      .ilike('code', `${code.charAt(0)}%`)
      .limit(10);
    
    return NextResponse.json({
      searchedFor: code,
      exactMatch: exactMatch || null,
      exactError: exactError?.message || null,
      caseInsensitiveMatches: allMatches || [],
      similarCodes: similarCodes || [],
      debug: {
        codeLength: code.length,
        firstChar: code.charAt(0),
        restOfCode: code.slice(1),
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error 
    }, { status: 500 });
  }
}