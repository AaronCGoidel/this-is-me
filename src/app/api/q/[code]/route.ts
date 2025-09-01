import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { executeAction } from '@/lib/qr/actions';
import { getCategoryFromCode } from '@/lib/qr/categories';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const resolvedParams = await params;
  const { code } = resolvedParams;
  
  if (!code) {
    return NextResponse.json(
      { error: 'QR code not provided' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  
  // Get user session if available
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  try {
    // Log the code we're looking for
    console.log('Looking for QR code:', code);
    
    // Fetch QR code with its actions
    const { data: qrCode, error: qrError } = await supabase
      .from('qr_codes')
      .select(`
        *,
        qr_actions (*)
      `)
      .eq('code', code)
      .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found

    if (qrError) {
      console.error('Database error:', qrError);
      return NextResponse.json(
        { error: 'Database error occurred', details: qrError.message },
        { status: 500 }
      );
    }
    
    if (!qrCode) {
      console.log(`QR code '${code}' not found`);
      
      // Try to help debug
      const { data: allCodes } = await supabase
        .from('qr_codes')
        .select('code')
        .limit(20);
      
      console.log('Available codes:', allCodes?.map(c => c.code));
      
      return NextResponse.json(
        { error: `QR code not found: ${code}` },
        { status: 404 }
      );
    }
    
    // Check if the code is active
    if (!qrCode.is_active) {
      return NextResponse.json(
        { error: 'QR code is inactive' },
        { status: 403 }
      );
    }

    // Record the scan
    await supabase.from('qr_scans').insert({
      qr_code_id: qrCode.id,
      user_id: userId,
      user_agent: request.headers.get('user-agent'),
    });

    // Update scan count
    await supabase
      .from('qr_codes')
      .update({
        scan_count: (qrCode.scan_count || 0) + 1,
        last_scanned_at: new Date().toISOString(),
      })
      .eq('id', qrCode.id);

    // Get category-specific data if needed
    const category = getCategoryFromCode(code);
    let catalogueItem = null;
    
    if (category === 'C') {
      const { data } = await supabase
        .from('catalogue_items')
        .select('*')
        .eq('qr_code_id', qrCode.id)
        .single();
      catalogueItem = data;
    }

    // Sort actions by priority
    const actions = qrCode.qr_actions?.sort((a, b) => 
      (b.priority || 0) - (a.priority || 0)
    ) || [];

    // Execute the highest priority valid action
    let actionResult = null;
    for (const action of actions) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await executeAction(action as any, userId);
      if (result.success) {
        actionResult = result;
        
        // Update scan record with action taken
        await supabase
          .from('qr_scans')
          .update({ action_taken: action.action_type })
          .eq('qr_code_id', qrCode.id)
          .order('scanned_at', { ascending: false })
          .limit(1);
        
        break;
      }
    }

    // Return QR code data with action result
    return NextResponse.json({
      success: true,
      qrCode: {
        id: qrCode.id,
        code: qrCode.code,
        category: qrCode.category,
        name: qrCode.name,
        description: qrCode.description,
        metadata: qrCode.metadata,
      },
      catalogueItem,
      action: actionResult,
      scanCount: (qrCode.scan_count || 0) + 1,
    });

  } catch (error) {
    console.error('Error processing QR code:', error);
    return NextResponse.json(
      { error: 'Failed to process QR code' },
      { status: 500 }
    );
  }
}