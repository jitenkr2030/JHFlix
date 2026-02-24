'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, User, Child, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

interface Profile {
  id: string
  name: string
  avatar?: string
  isKids: boolean
  preferences?: any
  createdAt: string
}

interface ProfileManagerProps {
  userId: string
  onProfileSelect?: (profile: Profile) => void
  selectedProfileId?: string
}

export function ProfileManager({ userId, onProfileSelect, selectedProfileId }: ProfileManagerProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    isKids: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const avatarOptions = [
    { emoji: '😀', name: 'Happy' },
    { emoji: '😎', name: 'Cool' },
    { emoji: '🤓', name: 'Nerd' },
    { emoji: '😊', name: 'Smile' },
    { emoji: '🎭', name: 'Drama' },
    { emoji: '🎬', name: 'Director' },
    { emoji: '🎵', name: 'Music' },
    { emoji: '🌟', name: 'Star' }
  ]

  useEffect(() => {
    fetchProfiles()
  }, [userId])

  const fetchProfiles = async () => {
    try {
      const response = await fetch(`/api/profiles?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setProfiles(data.profiles)
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error)
    }
  }

  const handleCreateProfile = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a profile name')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: formData.name,
          avatar: formData.avatar,
          isKids: formData.isKids
        })
      })

      const data = await response.json()
      if (response.ok) {
        setProfiles([...profiles, data.profile])
        setFormData({ name: '', avatar: '', isKids: false })
        setIsCreateModalOpen(false)
        alert('Profile created successfully!')
      } else {
        alert(data.error || 'Failed to create profile')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!editingProfile || !formData.name.trim()) {
      alert('Please enter a profile name')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/profiles/${editingProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          avatar: formData.avatar,
          isKids: formData.isKids
        })
      })

      if (response.ok) {
        const updatedProfiles = profiles.map(p => 
          p.id === editingProfile.id 
            ? { ...p, ...formData }
            : p
        )
        setProfiles(updatedProfiles)
        setEditingProfile(null)
        setFormData({ name: '', avatar: '', isKids: false })
        alert('Profile updated successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update profile')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) {
      return
    }

    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProfiles(profiles.filter(p => p.id !== profileId))
        alert('Profile deleted successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete profile')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  const openEditModal = (profile: Profile) => {
    setEditingProfile(profile)
    setFormData({
      name: profile.name,
      avatar: profile.avatar || '',
      isKids: profile.isKids
    })
  }

  const resetForm = () => {
    setFormData({ name: '', avatar: '', isKids: false })
    setEditingProfile(null)
  }

  return (
    <div className="space-y-6">
      {/* Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {profiles.map((profile) => (
          <Card 
            key={profile.id}
            className={`bg-gray-900 border-gray-800 cursor-pointer transition-all hover:scale-105 ${
              selectedProfileId === profile.id ? 'ring-2 ring-red-600' : ''
            }`}
            onClick={() => onProfileSelect?.(profile)}
          >
            <CardContent className="p-4 text-center">
              <div className="relative">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-red-600 to-orange-600">
                    {profile.isKids ? <Child className="w-10 h-10" /> : <User className="w-10 h-10" />}
                  </AvatarFallback>
                </Avatar>
                {selectedProfileId === profile.id && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-sm mb-1 truncate">{profile.name}</h3>
              {profile.isKids && (
                <Badge variant="secondary" className="text-xs">Kids</Badge>
              )}
              <div className="flex justify-center gap-1 mt-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditModal(profile)
                  }}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                {profiles.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteProfile(profile.id)
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Profile Button */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Card className="bg-gray-900 border-gray-800 border-dashed cursor-pointer transition-all hover:scale-105 hover:border-red-600">
              <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full min-h-[180px]">
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-400">Add Profile</span>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white border-gray-800">
            <DialogHeader>
              <DialogTitle>Create New Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profileName">Profile Name</Label>
                <Input
                  id="profileName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter profile name"
                  className="bg-gray-800 border-gray-700"
                  maxLength={20}
                />
              </div>

              <div>
                <Label>Avatar</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {avatarOptions.map((option) => (
                    <button
                      key={option.emoji}
                      onClick={() => setFormData({ ...formData, avatar: option.emoji })}
                      className={`p-3 rounded-lg border-2 text-2xl transition-all ${
                        formData.avatar === option.emoji
                          ? 'border-red-600 bg-red-600/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="kidsProfile"
                  checked={formData.isKids}
                  onCheckedChange={(checked) => setFormData({ ...formData, isKids: checked })}
                />
                <Label htmlFor="kidsProfile">Kids Profile</Label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    resetForm()
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProfile}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <Dialog open={!!editingProfile} onOpenChange={() => setEditingProfile(null)}>
          <DialogContent className="bg-gray-900 text-white border-gray-800">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editProfileName">Profile Name</Label>
                <Input
                  id="editProfileName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter profile name"
                  className="bg-gray-800 border-gray-700"
                  maxLength={20}
                />
              </div>

              <div>
                <Label>Avatar</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {avatarOptions.map((option) => (
                    <button
                      key={option.emoji}
                      onClick={() => setFormData({ ...formData, avatar: option.emoji })}
                      className={`p-3 rounded-lg border-2 text-2xl transition-all ${
                        formData.avatar === option.emoji
                          ? 'border-red-600 bg-red-600/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="editKidsProfile"
                  checked={formData.isKids}
                  onCheckedChange={(checked) => setFormData({ ...formData, isKids: checked })}
                />
                <Label htmlFor="editKidsProfile">Kids Profile</Label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingProfile(null)
                    resetForm()
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}