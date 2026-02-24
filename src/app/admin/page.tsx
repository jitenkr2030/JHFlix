'use client'

import { useState, useEffect } from 'react'
import { Users, Film, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, Eye, Edit, Trash2, BarChart3, Settings, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock admin data
const mockAdminStats = {
  totalUsers: 15420,
  totalCreators: 234,
  totalVideos: 1247,
  totalRevenue: 245600,
  pendingApprovals: 12,
  activeSubscriptions: 8934
}

const mockPendingVideos = [
  {
    id: '1',
    title: 'Nagpuri Love Story',
    creator: 'Jharkhand Films',
    category: 'MOVIE',
    language: 'Nagpuri',
    uploadedAt: '2024-01-20',
    duration: 8160,
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=60&fit=crop'
  },
  {
    id: '2',
    title: 'Santali Folk Dance',
    creator: 'Tribal Arts',
    category: 'CULTURE',
    language: 'Santali',
    uploadedAt: '2024-01-19',
    duration: 2720,
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=60&fit=crop'
  }
]

const mockUsers = [
  {
    id: '1',
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    role: 'USER',
    subscription: 'MONTHLY',
    joinDate: '2023-06-15',
    lastActive: '2024-01-20',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jharkhand Films',
    email: 'contact@jharkhandfilms.com',
    role: 'CREATOR',
    subscription: 'PREMIUM',
    joinDate: '2023-01-15',
    lastActive: '2024-01-20',
    status: 'active'
  }
]

const mockTransactions = [
  {
    id: '1',
    user: 'Rahul Kumar',
    amount: 299,
    plan: 'MONTHLY',
    status: 'completed',
    date: '2024-01-20'
  },
  {
    id: '2',
    user: 'Priya Sharma',
    amount: 2990,
    plan: 'YEARLY',
    status: 'completed',
    date: '2024-01-19'
  }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [pendingVideos, setPendingVideos] = useState(mockPendingVideos)
  const [users, setUsers] = useState(mockUsers)
  const [transactions, setTransactions] = useState(mockTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleApproveVideo = async (videoId: string) => {
    try {
      // API call to approve video
      const response = await fetch(`/api/admin/videos/${videoId}/approve`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setPendingVideos(pendingVideos.filter(v => v.id !== videoId))
        alert('Video approved successfully!')
      } else {
        alert('Failed to approve video')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  const handleRejectVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to reject this video?')) {
      return
    }

    try {
      // API call to reject video
      const response = await fetch(`/api/admin/videos/${videoId}/reject`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setPendingVideos(pendingVideos.filter(v => v.id !== videoId))
        alert('Video rejected successfully!')
      } else {
        alert('Failed to reject video')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    
    try {
      // API call to update user status
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: newStatus } : u
        ))
        alert(`User ${newStatus} successfully!`)
      } else {
        alert('Failed to update user status')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JHFlix Admin</span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="hover:text-red-500 transition-colors"
                >
                  <Home className="w-4 h-4 inline mr-1" />
                  Home
                </button>
                <button className="text-red-500 font-semibold">Admin Panel</button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-red-600 to-orange-600">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm">Admin</span>
              </div>
              
              <Button variant="ghost" size="icon" className="text-white">
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-white hover:text-red-500">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockAdminStats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Users</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Film className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockAdminStats.totalCreators}</div>
                <div className="text-sm text-gray-400">Creators</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Film className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockAdminStats.totalVideos}</div>
                <div className="text-sm text-gray-400">Videos</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">₹{mockAdminStats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Revenue</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockAdminStats.pendingApprovals}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{mockAdminStats.activeSubscriptions.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Active Subs</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-900 border-gray-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="approvals" className="data-[state=active]:bg-red-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Content Approval
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-red-600">
                <Users className="w-4 h-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-red-600">
                <DollarSign className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approvals">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Pending Content Approvals ({pendingVideos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingVideos.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-400">No pending approvals</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingVideos.map((video) => (
                        <div key={video.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-20 h-12 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-semibold">{video.title}</h3>
                              <p className="text-sm text-gray-400">
                                by {video.creator} • {video.category} • {video.language} • {formatDuration(video.duration)}
                              </p>
                              <p className="text-xs text-gray-500">Uploaded: {video.uploadedAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveVideo(video.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectVideo(video.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border-gray-700 w-64"
                      />
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="USER">Users</SelectItem>
                          <SelectItem value="CREATOR">Creators</SelectItem>
                          <SelectItem value="ADMIN">Admins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.subscription}</TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === 'active' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={user.status === 'active'}
                                onCheckedChange={() => handleToggleUserStatus(user.id, user.status)}
                              />
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm">#{transaction.id}</TableCell>
                          <TableCell>{transaction.user}</TableCell>
                          <TableCell>₹{transaction.amount}</TableCell>
                          <TableCell>{transaction.plan}</TableCell>
                          <TableCell>
                            <Badge variant="default" className="text-xs bg-green-600">
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
                      <Clock className="w-4 h-4 mr-2" />
                      Review Pending Approvals ({mockAdminStats.pendingApprovals})
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      View Revenue Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Platform Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Server Status</span>
                      <Badge className="bg-green-600">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database</span>
                      <Badge className="bg-green-600">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>CDN Status</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Storage Used</span>
                      <span className="text-sm text-gray-400">45.2 GB / 100 GB</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}