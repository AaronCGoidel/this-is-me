import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
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
    // Create some initial QR codes for testing
    const testCodes = [
      {
        code: 'WGUEST',
        category: 'W',
        base58_id: 'GUEST',
        name: 'Guest WiFi',
        description: 'Connect to the guest WiFi network',
        is_active: true,
      },
      {
        code: 'PABOUT',
        category: 'P',
        base58_id: 'ABOUT',
        name: 'About Me',
        description: 'Ask about Aaron',
        is_active: true,
      },
      {
        code: 'SGITHB',
        category: 'S',
        base58_id: 'GITHB',
        name: 'GitHub Profile',
        description: 'View my GitHub profile',
        is_active: true,
      },
    ];
    
    const { data, error } = await supabase
      .from('qr_codes')
      .insert(testCodes)
      .select();
    
    if (error) {
      // If error is duplicate key, that's ok
      if (error.code === '23505') {
        return NextResponse.json({ 
          message: 'QR codes already initialized',
          error: error.message 
        });
      }
      throw error;
    }
    
    // Add some test actions
    if (data && data.length > 0) {
      const actions = [
        {
          qr_code_id: data.find(qr => qr.code === 'WGUEST')?.id,
          action_type: 'connect_wifi',
          action_data: {
            ssid: 'GuestNetwork',
            password: 'welcome123',
            security: 'WPA'
          },
          priority: 1,
          requires_auth: false,
        },
        {
          qr_code_id: data.find(qr => qr.code === 'PABOUT')?.id,
          action_type: 'inject_prompt',
          action_data: {
            prompt: 'Tell me about Aaron - his background, interests, and what he does.'
          },
          priority: 1,
          requires_auth: false,
        },
        {
          qr_code_id: data.find(qr => qr.code === 'SGITHB')?.id,
          action_type: 'redirect_url',
          action_data: {
            url: 'https://github.com/aarongoidel'
          },
          priority: 1,
          requires_auth: false,
        },
      ].filter(action => action.qr_code_id); // Only include if QR code was created
      
      if (actions.length > 0) {
        await supabase.from('qr_actions').insert(actions);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'QR codes initialized successfully',
      codes: data 
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize QR codes',
      details: error 
    }, { status: 500 });
  }
}