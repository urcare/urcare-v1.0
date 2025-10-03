import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, resend } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await emailService.sendVerificationCode({
      email,
      fullName: fullName || '',
      resend: resend || false
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    });
  } catch (error) {
    console.error('Send verification API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
