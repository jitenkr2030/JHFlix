import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(10)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = sendOtpSchema.parse(body)

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // In production, you would:
    // 1. Store OTP in database with expiration
    // 2. Send OTP via SMS gateway
    // 3. Rate limit requests
    
    console.log(`OTP for ${phone}: ${otp}`) // Demo only
    
    // For demo purposes, we'll just return success
    // In production, use actual SMS service like Twilio, etc.
    
    return NextResponse.json({
      message: 'OTP sent successfully',
      // For demo only, don't return OTP in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}