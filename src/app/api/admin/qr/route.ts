import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateQRCodes, saveGeneratedCodes } from '@/lib/qr/generator';
import { isValidCategory } from '@/lib/qr/categories';

// GET: List all QR codes
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  // Check admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: isAdmin } = await supabase.rpc('is_admin', { p_uid: user.id });
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Get query params for filtering
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const isActive = searchParams.get('active');
  
  try {
    let query = supabase
      .from('qr_codes')
      .select(`
        *,
        qr_actions (
          id,
          action_type,
          action_data,
          priority,
          requires_auth
        ),
        catalogue_items (
          id,
          title,
          item_type
        )
      `)
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
}

// POST: Create new QR codes
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  // Check admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: isAdmin } = await supabase.rpc('is_admin', { p_uid: user.id });
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { category, count = 1, namePrefix, action } = body;
    
    if (!category || !isValidCategory(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    // Generate QR codes
    const codes = await generateQRCodes({
      category,
      count,
      namePrefix
    });
    
    // Save to database
    const savedCodes = await saveGeneratedCodes(codes);
    
    // If action data provided, create actions for all codes
    if (action && savedCodes) {
      const actions = savedCodes.map((code: { id: number }) => ({
        qr_code_id: code.id,
        action_type: action.type,
        action_data: action.data,
        priority: action.priority || 0,
        requires_auth: action.requires_auth || false,
      }));
      
      await supabase.from('qr_actions').insert(actions);
    }
    
    return NextResponse.json({
      success: true,
      data: savedCodes,
      count: savedCodes?.length || 0
    });
  } catch (error) {
    console.error('Error creating QR codes:', error);
    return NextResponse.json(
      { error: 'Failed to create QR codes' },
      { status: 500 }
    );
  }
}

// PUT: Update QR code
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  
  // Check admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: isAdmin } = await supabase.rpc('is_admin', { p_uid: user.id });
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'QR code ID required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('qr_codes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to update QR code' },
      { status: 500 }
    );
  }
}

// DELETE: Delete QR code
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  
  // Check admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: isAdmin } = await supabase.rpc('is_admin', { p_uid: user.id });
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'QR code ID required' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('qr_codes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json(
      { error: 'Failed to delete QR code' },
      { status: 500 }
    );
  }
}