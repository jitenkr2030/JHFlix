'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Eye, DollarSign, Calendar, Download, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface AnalyticsDashboardProps {
  userId?: string
  userRole?: 'USER' | 'CREATOR' | 'ADMIN'
}

export function AnalyticsDashboard({ userId, userRole = 'USER' }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('7d')
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, userId, userRole])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        timeRange,
        userRole,
        ...(userId && { userId })
      })
      
      const response = await fetch(`/api/analytics?${params}`)
      const data = await response.json()
      if (response.ok) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      const params = new URLSearchParams({
        timeRange,
        userRole,
        format: 'csv',
        ...(userId && { userId })
      })
      
      const response = await fetch(`/api/analytics/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      alert('Failed to export report')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  // Mock analytics data based on user role
  const getAnalyticsData = () => {
    switch (userRole) {
      case 'ADMIN':
        return {
          overview: {
            totalUsers: 15420,
            totalCreators: 234,
            totalVideos: 1247,
            totalRevenue: 245600,
            activeSubscriptions: 8934,
            avgWatchTime: 65
          },
          charts: {
            userGrowth: [120, 135, 125, 145, 160, 155, 170],
            revenue: [45000, 48000, 52000, 49000, 55000, 58000, 62000],
            watchTime: [1200, 1350, 1400, 1550, 1600, 1750, 1800]
          },
          topContent: [
            { title: 'Nagpuri Love Story', views: 15420, revenue: 2340 },
            { title: 'Santali Folk Festival', views: 12340, revenue: 1890 },
            { title: 'Jharkhand Ki Kahani', views: 10230, revenue: 1560 }
          ]
        }
      case 'CREATOR':
        return {
          overview: {
            totalViews: 125000,
            totalWatchTime: 89000,
            subscribers: 1542,
            revenue: 4560,
            avgEngagement: 12.5,
            videosCount: 24
          },
          charts: {
            views: [1200, 1350, 1400, 1550, 1600, 1750, 1800],
            revenue: [450, 480, 520, 490, 550, 580, 620],
            subscribers: [100, 120, 115, 130, 145, 140, 155]
          },
          topVideos: [
            { title: 'Nagpuri Love Story', views: 15420, likes: 892, revenue: 234 },
            { title: 'Santali Folk Dance', views: 8934, likes: 567, revenue: 145 },
            { title: 'Jharkhand Documentary', views: 5678, likes: 234, revenue: 89 }
          ]
        }
      default:
        return {
          overview: {
            totalWatched: 47,
            totalWatchTime: 2820, // minutes
            favoriteGenre: 'Movies',
            avgSessionTime: 45,
            contentLiked: 23
          },
          charts: {
            watchTime: [60, 45, 90, 120, 75, 60, 90],
            activity: [2, 1, 3, 4, 2, 2, 3]
          },
          recentActivity: [
            { title: 'Nagpuri Love Story', watchedAt: '2024-01-20', duration: 135 },
            { title: 'Santali Folk Festival', watchedAt: '2024-01-19', duration: 45 },
            { title: 'Jharkhand Ki Kahani', watchedAt: '2024-01-18', duration: 105 }
          ]
        }
    }
  }

  const data = getAnalyticsData()

  const renderOverviewCards = () => {
    const cards = userRole === 'ADMIN' ? [
      { label: 'Total Users', value: data.overview.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500' },
      { label: 'Total Creators', value: data.overview.totalCreators.toLocaleString(), icon: Users, color: 'text-green-500' },
      { label: 'Total Videos', value: data.overview.totalVideos.toLocaleString(), icon: Eye, color: 'text-purple-500' },
      { label: 'Total Revenue', value: `₹${data.overview.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-500' },
      { label: 'Active Subscriptions', value: data.overview.activeSubscriptions.toLocaleString(), icon: TrendingUp, color: 'text-red-500' },
      { label: 'Avg Watch Time', value: `${data.overview.avgWatchTime}%`, icon: BarChart3, color: 'text-orange-500' }
    ] : userRole === 'CREATOR' ? [
      { label: 'Total Views', value: data.overview.totalViews.toLocaleString(), icon: Eye, color: 'text-blue-500' },
      { label: 'Watch Time', value: `${Math.floor(data.overview.totalWatchTime / 60)}h`, icon: BarChart3, color: 'text-green-500' },
      { label: 'Subscribers', value: data.overview.subscribers.toLocaleString(), icon: Users, color: 'text-purple-500' },
      { label: 'Revenue', value: `₹${data.overview.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-500' },
      { label: 'Engagement', value: `${data.overview.avgEngagement}%`, icon: TrendingUp, color: 'text-red-500' },
      { label: 'Videos', value: data.overview.videosCount, icon: Eye, color: 'text-orange-500' }
    ] : [
      { label: 'Videos Watched', value: data.overview.totalWatched, icon: Eye, color: 'text-blue-500' },
      { label: 'Watch Time', value: `${Math.floor(data.overview.totalWatchTime / 60)}h`, icon: BarChart3, color: 'text-green-500' },
      { label: 'Favorite Genre', value: data.overview.favoriteGenre, icon: TrendingUp, color: 'text-purple-500' },
      { label: 'Avg Session', value: `${data.overview.avgSessionTime}m`, icon: Calendar, color: 'text-yellow-500' },
      { label: 'Content Liked', value: data.overview.contentLiked, icon: TrendingUp, color: 'text-red-500' }
    ]

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Icon className={`w-8 h-8 ${card.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm text-gray-400">{card.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const renderCharts = () => {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <BarChart3 className="w-12 h-12 mr-2" />
              Chart Visualization (Integration needed)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>
              {userRole === 'ADMIN' ? 'Top Content' : 
               userRole === 'CREATOR' ? 'Top Videos' : 'Recent Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(userRole === 'ADMIN' ? data.topContent : 
                userRole === 'CREATOR' ? data.topVideos : 
                data.recentActivity).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      {userRole === 'USER' ? `${item.watchedAt} • ${item.duration} min` :
                       userRole === 'CREATOR' ? `${item.views.toLocaleString()} views • ₹${item.revenue}` :
                       `${item.views.toLocaleString()} views • ₹${item.revenue}`}
                    </p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="outline" className="border-gray-600">
            {userRole === 'ADMIN' ? 'Admin View' :
             userRole === 'CREATOR' ? 'Creator View' : 'User View'}
          </Badge>
        </div>

        <Button onClick={exportReport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overview Cards */}
      {renderOverviewCards()}

      {/* Charts and Details */}
      {renderCharts()}

      {/* Detailed Table */}
      {userRole !== 'USER' && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>
              {userRole === 'ADMIN' ? 'Recent Transactions' : 'Video Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {userRole === 'ADMIN' ? (
                    <>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Date</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Video</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Watch Time</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Engagement</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Mock table data */}
                {[1, 2, 3, 4, 5].map((item) => (
                  <TableRow key={item}>
                    {userRole === 'ADMIN' ? (
                      <>
                        <TableCell className="font-mono text-sm">#TXN00{item}</TableCell>
                        <TableCell>User {item}</TableCell>
                        <TableCell>₹{299 * item}</TableCell>
                        <TableCell>MONTHLY</TableCell>
                        <TableCell>2024-01-{20 - item}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>Video {item}</TableCell>
                        <TableCell>{(1000 * item).toLocaleString()}</TableCell>
                        <TableCell>{(50 * item)}h</TableCell>
                        <TableCell>₹{(50 * item)}</TableCell>
                        <TableCell>{(10 + item * 2)}%</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}