import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const subscriptionSchema = z.object({
  userId: z.string(),
  plan: z.enum(['MONTHLY', 'YEARLY', 'LIFETIME']),
  paymentId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, plan, paymentId } = subscriptionSchema.parse(body)

    // Calculate price and duration
    const planDetails = {
      MONTHLY: { price: 299, duration: 30 },
      YEARLY: { price: 2990, duration: 365 },
      LIFETIME: { price: 9990, duration: 36500 } // 100 years
    }

    const { price, duration } = planDetails[plan]
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + duration)

    // Create subscription
    const subscription = await db.subscription.create({
      data: {
        userId,
        plan,
        price,
        currency: 'INR',
        startDate,
        endDate,
        isActive: true,
        paymentId
      }
    })

    // Update user's subscription info
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionId: subscription.id,
        subscriptionEnd: endDate
      }
    })

    return NextResponse.json({
      subscription,
      message: 'Subscription created successfully'
    })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

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

    const subscriptions = await db.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Get current active subscription
    const activeSubscription = subscriptions.find(sub => 
      sub.isActive && new Date(sub.endDate) > new Date()
    )

    return NextResponse.json({
      subscriptions,
      activeSubscription,
      hasActiveSubscription: !!activeSubscription
    })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}