import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    // Update video status to approved
    const video = await db.video.update({
      where: { id: videoId },
      data: {
        isPublic: true,
        approvedAt: new Date()
      }
    })

    // Create notification for creator (in production)
    console.log(`Video ${videoId} approved and published`)

    return NextResponse.json({
      video,
      message: 'Video approved successfully'
    })
  } catch (error) {
    console.error('Approve video error:', error)
    return NextResponse.json(
      { error: 'Failed to approve video' },
      { status: 500 }
    )
  }
}