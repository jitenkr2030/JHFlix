'use client'

import { useState, useEffect } from 'react'
import { User, Clock, Heart, Play, List, Settings, LogOut, Home, Search, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ProfileManager } from '@/components/profile/profile-manager'
import { WatchlistManager } from '@/components/watchlist/watchlist-manager'
import { SubscriptionManager } from '@/components/subscription/subscription-manager'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

// Mock user data - in production, get from auth context
const mockUser = {
  id: 'user1',
  name: 'Rahul Kumar',
  email: 'rahul@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  role: 'USER',
  subscription: {
    plan: 'MONTHLY',
    endDate: '2024-12-31',
    isActive: true
  }
}

const mockStats = {
  totalWatched: 47,
  hoursWatched: 124,
  favoriteGenre: 'Movies',
  profileCount: 3
}

const recentActivity = [
  { id: '1', type: 'watched', video: 'Nagpuri Love Story', time: '2 hours ago' },
  { id: '2', type: 'added', video: 'Santali Folk Festival', time: '1 day ago' },
  { id: '3', type: 'watched', video: 'Jharkhand Ki Kahani', time: '3 days ago' },
  { id: '4', type: 'liked', video: 'Khortha Comedy Special', time: '1 week ago' }
]

export default function DashboardPage() {
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('profiles')

  useEffect(() => {
    // Set first profile as selected by default
    // In production, get from user preferences
  }, [])

  const handleProfileSelect = (profile: any) => {
    setSelectedProfile(profile)
    // In production, update user context with selected profile
  }

  const handleLogout = () => {
    // In production, clear auth state and redirect to login
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JHFlix</span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="hover:text-red-500 transition-colors"
                >
                  <Home className="w-4 h-4 inline mr-1" />
                  Home
                </button>
                <button className="hover:text-red-500 transition-colors">
                  <Search className="w-4 h-4 inline mr-1" />
                  Browse
                </button>
                <button className="text-red-500 font-semibold">
                  <User className="w-4 h-4 inline mr-1" />
                  Dashboard
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {selectedProfile && (
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedProfile.avatar} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-red-600 to-orange-600">
                      {selectedProfile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm">{selectedProfile.name}</span>
                </div>
              )}
              
              <Button variant="ghost" size="icon" className="text-white">
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-white hover:text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {mockUser.name}!
            </h1>
            <p className="text-gray-400">
              Manage your profiles and watchlist from here
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Play className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockStats.totalWatched}</div>
                <div className="text-sm text-gray-400">Videos Watched</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockStats.hoursWatched}</div>
                <div className="text-sm text-gray-400">Hours Watched</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockStats.favoriteGenre}</div>
                <div className="text-sm text-gray-400">Favorite Genre</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <User className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockStats.profileCount}</div>
                <div className="text-sm text-gray-400">Profiles</div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Status */}
          <Card className="bg-gradient-to-r from-red-600 to-orange-600 border-none mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Premium Active</h3>
                  <p className="text-white/80">
                    Your {mockUser.subscription.plan} subscription is active until {new Date(mockUser.subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge className="bg-white text-red-600">
                  PREMIUM
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-900 border-gray-800">
              <TabsTrigger value="profiles" className="data-[state=active]:bg-red-600">
                <User className="w-4 h-4 mr-2" />
                Profiles
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="data-[state=active]:bg-red-600">
                <List className="w-4 h-4 mr-2" />
                My Watchlist
              </TabsTrigger>
              <TabsTrigger value="subscription" className="data-[state=active]:bg-red-600">
                <DollarSign className="w-4 h-4 mr-2" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                My Analytics
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-red-600">
                <Clock className="w-4 h-4 mr-2" />
                Recent Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profiles">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Manage Profiles</CardTitle>
                  <p className="text-gray-400">
                    Create and manage up to 5 profiles for different family members
                  </p>
                </CardHeader>
                <CardContent>
                  <ProfileManager 
                    userId={mockUser.id}
                    onProfileSelect={handleProfileSelect}
                    selectedProfileId={selectedProfile?.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="watchlist">
              <WatchlistManager userId={mockUser.id} />
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionManager userId={mockUser.id} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard userId={mockUser.id} userRole="USER" />
            </TabsContent>

            <TabsContent value="activity">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <p className="text-gray-400">
                    Your recent watching and activity history
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'watched' ? 'bg-green-600' :
                            activity.type === 'added' ? 'bg-blue-600' :
                            'bg-red-600'
                          }`}>
                            {activity.type === 'watched' ? <Play className="w-4 h-4" /> :
                             activity.type === 'added' ? <List className="w-4 h-4" /> :
                             <Heart className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium">{activity.video}</p>
                            <p className="text-sm text-gray-400">
                              {activity.type === 'watched' ? 'Watched' :
                               activity.type === 'added' ? 'Added to watchlist' :
                               'Liked'} • {activity.time}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}