import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST: Create new QR action
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
    const { qr_code_id, ...actionData } = body;
    
    if (!qr_code_id) {
      return NextResponse.json(
        { error: 'QR code ID required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('qr_actions')
      .insert({
        qr_code_id,
        ...actionData,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating QR action:', error);
    return NextResponse.json(
      { error: 'Failed to create QR action' },
      { status: 500 }
    );
  }
}

// DELETE: Delete QR action
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
        { error: 'Action ID required' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('qr_actions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting QR action:', error);
    return NextResponse.json(
      { error: 'Failed to delete QR action' },
      { status: 500 }
    );
  }
}