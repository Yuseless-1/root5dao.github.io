import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    const supabase = createServerClient();

    // Verify token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  }
}

