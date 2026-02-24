import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profileId = params.id
    const body = await request.json()
    const { name, avatar, isKids, preferences } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const profile = await db.userProfile.update({
      where: { id: profileId },
      data: {
        name,
        avatar,
        isKids,
        preferences: preferences || {}
      }
    })

    return NextResponse.json({
      profile,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profileId = params.id

    // Check if user has more than 1 profile before deletion
    const profile = await db.userProfile.findUnique({
      where: { id: profileId },
      include: { user: { include: { profiles: true } } }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    if (profile.user.profiles.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last profile' },
        { status: 400 }
      )
    }

    await db.userProfile.delete({
      where: { id: profileId }
    })

    return NextResponse.json({
      message: 'Profile deleted successfully'
    })
  } catch (error) {
    console.error('Delete profile error:', error)
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    )
  }
}