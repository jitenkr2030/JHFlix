import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const profiles = await db.userProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Get profiles error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, avatar, isKids, preferences } = body

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      )
    }

    // Check if user already has 5 profiles (Netflix limit)
    const existingProfiles = await db.userProfile.count({
      where: { userId }
    })

    if (existingProfiles >= 5) {
      return NextResponse.json(
        { error: 'Maximum 5 profiles allowed per user' },
        { status: 400 }
      )
    }

    const profile = await db.userProfile.create({
      data: {
        userId,
        name,
        avatar,
        isKids: isKids || false,
        preferences: preferences || {}
      }
    })

    return NextResponse.json({
      profile,
      message: 'Profile created successfully'
    })
  } catch (error) {
    console.error('Create profile error:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}