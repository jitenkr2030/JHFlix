import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find active subscription
    const activeSubscription = await db.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    })

    if (!activeSubscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Cancel subscription (set isActive to false)
    await db.subscription.update({
      where: { id: activeSubscription.id },
      data: { isActive: false }
    })

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      willContinueUntil: activeSubscription.endDate
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}