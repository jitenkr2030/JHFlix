import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    const userRole = searchParams.get('userRole') || 'USER'
    const userId = searchParams.get('userId')

    // Calculate date range based on timeRange
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '24h':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    let analytics: any = {}

    if (userRole === 'ADMIN') {
      // Admin analytics
      const [
        totalUsers,
        totalCreators,
        totalVideos,
        totalRevenue,
        activeSubscriptions,
        recentTransactions
      ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { role: 'CREATOR' } }),
        db.video.count({ where: { isPublic: true } }),
        db.subscription.aggregate({ _sum: { price: true } }),
        db.subscription.count({
          where: {
            isActive: true,
            endDate: { gt: now }
          }
        }),
        db.subscription.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true }
            }
          }
        })
      ])

      analytics = {
        overview: {
          totalUsers,
          totalCreators,
          totalVideos,
          totalRevenue: totalRevenue._sum.price || 0,
          activeSubscriptions,
          avgWatchTime: 65 // Mock data
        },
        charts: {
          userGrowth: [120, 135, 125, 145, 160, 155, 170], // Mock data
          revenue: [45000, 48000, 52000, 49000, 55000, 58000, 62000],
          watchTime: [1200, 1350, 1400, 1550, 1600, 1750, 1800]
        },
        topContent: [
          { title: 'Nagpuri Love Story', views: 15420, revenue: 2340 },
          { title: 'Santali Folk Festival', views: 12340, revenue: 1890 },
          { title: 'Jharkhand Ki Kahani', views: 10230, revenue: 1560 }
        ],
        recentTransactions: recentTransactions.map(t => ({
          id: t.id,
          user: t.user.name,
          amount: t.price,
          plan: t.plan,
          date: t.createdAt.toISOString().split('T')[0]
        }))
      }
    } else if (userRole === 'CREATOR' && userId) {
      // Creator analytics
      const [
        creatorVideos,
        totalViews,
        totalWatchTime,
        creatorRevenue,
        subscribers
      ] = await Promise.all([
        db.video.count({
          where: { 
            createdBy: userId,
            isPublic: true 
          }
        }),
        db.video.aggregate({
          where: { 
            createdBy: userId,
            isPublic: true 
          },
          _sum: { viewCount: true }
        }),
        db.watchHistory.aggregate({
          _sum: { watchTime: true },
          where: {
            video: { createdBy: userId }
          }
        }),
        db.subscription.aggregate({
          _sum: { price: true },
          where: {
            user: {
              uploadedContent: {
                some: { createdBy: userId }
              }
            }
          }
        }),
        // Mock subscriber count - in production, implement proper follower system
        Promise.resolve(1542)
      ])

      analytics = {
        overview: {
          totalViews: totalViews._sum.viewCount || 0,
          totalWatchTime: totalWatchTime._sum.watchTime || 0,
          subscribers,
          revenue: creatorRevenue._sum.price || 0,
          avgEngagement: 12.5, // Mock data
          videosCount: creatorVideos
        },
        charts: {
          views: [1200, 1350, 1400, 1550, 1600, 1750, 1800], // Mock data
          revenue: [450, 480, 520, 490, 550, 580, 620],
          subscribers: [100, 120, 115, 130, 145, 140, 155]
        },
        topVideos: [
          { title: 'Nagpuri Love Story', views: 15420, likes: 892, revenue: 234 },
          { title: 'Santali Folk Dance', views: 8934, likes: 567, revenue: 145 },
          { title: 'Jharkhand Documentary', views: 5678, likes: 234, revenue: 89 }
        ]
      }
    } else if (userId) {
      // User analytics
      const [
        watchedVideos,
        totalWatchTime,
        likedVideos,
        watchHistory
      ] = await Promise.all([
        db.watchHistory.count({
          where: { userId }
        }),
        db.watchHistory.aggregate({
          _sum: { watchTime: true },
          where: { userId }
        }),
        db.review.count({
          where: { userId }
        }),
        db.watchHistory.findMany({
          where: { userId },
          include: {
            video: {
              select: { title: true, duration: true }
            }
          },
          orderBy: { watchedAt: 'desc' },
          take: 10
        })
      ])

      analytics = {
        overview: {
          totalWatched: watchedVideos,
          totalWatchTime: totalWatchTime._sum.watchTime || 0,
          favoriteGenre: 'Movies', // Mock data
          avgSessionTime: 45, // Mock data
          contentLiked: likedVideos
        },
        charts: {
          watchTime: [60, 45, 90, 120, 75, 60, 90], // Mock data
          activity: [2, 1, 3, 4, 2, 2, 3]
        },
        recentActivity: watchHistory.map(h => ({
          title: h.video.title,
          watchedAt: h.watchedAt.toISOString().split('T')[0],
          duration: Math.floor(h.video.duration / 60)
        }))
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Handle custom analytics queries
  try {
    const body = await request.json()
    const { query, filters } = body

    // In production, implement custom query processing
    return NextResponse.json({
      message: 'Custom analytics query processed',
      data: [] // Return query results
    })
  } catch (error) {
    console.error('Custom analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to process custom query' },
      { status: 500 }
    )
  }
}