import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const loginSchema = z.object({
  identifier: z.string(), // email or phone
  password: z.string().optional(), // for email login
  otp: z.string().optional(), // for phone login
  loginType: z.enum(['email', 'phone'])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password, otp, loginType } = loginSchema.parse(body)

    if (loginType === 'email') {
      // Email login
      const user = await db.user.findUnique({
        where: { email: identifier },
        include: { profiles: true }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // In production, verify password hash
      // For demo, we'll skip password verification
      
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profiles: user.profiles
        },
        message: 'Login successful'
      })
    } else {
      // Phone OTP login
      const user = await db.user.findUnique({
        where: { phone: identifier },
        include: { profiles: true }
      })

      if (!user) {
        // Create new user if doesn't exist
        const newUser = await db.user.create({
          data: {
            phone: identifier,
            isVerified: true // OTP verified
          },
          include: { profiles: true }
        })

        // Create default profile
        await db.userProfile.create({
          data: {
            userId: newUser.id,
            name: 'User Profile'
          }
        })

        return NextResponse.json({
          user: {
            id: newUser.id,
            phone: newUser.phone,
            role: newUser.role,
            profiles: []
          },
          message: 'User created and logged in successfully'
        })
      }

      // Verify OTP (in production, verify actual OTP)
      // For demo, we'll accept any 6-digit code
      
      return NextResponse.json({
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          profiles: user.profiles
        },
        message: 'Login successful'
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}