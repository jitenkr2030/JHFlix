'use client'

import { useState, useRef } from 'react'
import { Upload, X, Film, Music, Tv, Calendar, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: (video: any) => void
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [uploadStep, setUploadStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: '',
    releaseYear: new Date().getFullYear(),
    ageRating: 'U',
    isPremium: false,
    tags: ''
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'MOVIE', label: 'Movie', icon: Film },
    { value: 'WEB_SERIES', label: 'Web Series', icon: Tv },
    { value: 'MUSIC', label: 'Music', icon: Music },
    { value: 'CULTURE', label: 'Culture', icon: Calendar },
    { value: 'DOCUMENTARY', label: 'Documentary', icon: FileText }
  ]

  const languages = [
    { value: 'HINDI', label: 'Hindi' },
    { value: 'ENGLISH', label: 'English' },
    { value: 'NAGPURI', label: 'Nagpuri' },
    { value: 'SANTALI', label: 'Santali' },
    { value: 'KHORTHA', label: 'Khortha' },
    { value: 'OTHER', label: 'Other' }
  ]

  const ageRatings = [
    { value: 'U', label: 'U (All Ages)' },
    { value: 'U_A', label: 'U/A (Parental Guidance)' },
    { value: 'A', label: 'A (Adults Only)' },
    { value: 'S', label: 'S (Special)' }
  ]

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate video file
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv']
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, video: 'Please select a valid video file (MP4, AVI, MOV, WMV)' })
        return
      }
      
      if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB limit
        setErrors({ ...errors, video: 'Video file size must be less than 2GB' })
        return
      }

      setVideoFile(file)
      setErrors({ ...errors, video: '' })
    }
  }

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate image file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, thumbnail: 'Please select a valid image file (JPG, PNG, WebP)' })
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, thumbnail: 'Image file size must be less than 5MB' })
        return
      }

      setThumbnailFile(file)
      setErrors({ ...errors, thumbnail: '' })

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!videoFile) {
      newErrors.video = 'Please select a video file'
    }
    if (!thumbnailFile) {
      newErrors.thumbnail = 'Please select a thumbnail image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.language) {
      newErrors.language = 'Language is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (uploadStep === 1 && validateStep1()) {
      setUploadStep(2)
    } else if (uploadStep === 2 && validateStep2()) {
      handleUpload()
    }
  }

  const handleUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Create form data for upload
      const uploadFormData = new FormData()
      uploadFormData.append('video', videoFile!)
      uploadFormData.append('thumbnail', thumbnailFile!)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('category', formData.category)
      uploadFormData.append('language', formData.language)
      uploadFormData.append('releaseYear', formData.releaseYear.toString())
      uploadFormData.append('ageRating', formData.ageRating)
      uploadFormData.append('isPremium', formData.isPremium.toString())
      uploadFormData.append('tags', formData.tags)

      // Simulate API call
      const response = await fetch('/api/creator/upload', {
        method: 'POST',
        body: uploadFormData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        setTimeout(() => {
          setIsUploading(false)
          onUploadComplete?.(data.video)
          handleClose()
        }, 1000)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Upload failed')
        setIsUploading(false)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setUploadStep(1)
    setFormData({
      title: '',
      description: '',
      category: '',
      language: '',
      releaseYear: new Date().getFullYear(),
      ageRating: 'U',
      isPremium: false,
      tags: ''
    })
    setVideoFile(null)
    setThumbnailFile(null)
    setThumbnailPreview('')
    setErrors({})
    setUploadProgress(0)
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Step 1: File Upload */}
        {uploadStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 1: Upload Files</h3>
              
              {/* Video Upload */}
              <div className="mb-6">
                <Label className="text-base font-medium">Video File *</Label>
                <div className="mt-2">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      errors.video 
                        ? 'border-red-500 bg-red-500/10' 
                        : videoFile 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {videoFile ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <p className="font-medium">{videoFile.name}</p>
                        <p className="text-sm text-gray-400">{formatFileSize(videoFile.size)}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="font-medium">Click to upload video</p>
                        <p className="text-sm text-gray-400">MP4, AVI, MOV, WMF (max 2GB)</p>
                      </div>
                    )}
                  </div>
                  {errors.video && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.video}
                    </p>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <Label className="text-base font-medium">Thumbnail Image *</Label>
                <div className="mt-2">
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      errors.thumbnail 
                        ? 'border-red-500 bg-red-500/10' 
                        : thumbnailFile 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {thumbnailPreview ? (
                      <div className="space-y-2">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-32 h-20 object-cover mx-auto rounded"
                        />
                        <p className="font-medium">{thumbnailFile?.name}</p>
                        <p className="text-sm text-gray-400">{formatFileSize(thumbnailFile?.size || 0)}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="font-medium">Click to upload thumbnail</p>
                        <p className="text-sm text-gray-400">JPG, PNG, WebP (max 5MB)</p>
                      </div>
                    )}
                  </div>
                  {errors.thumbnail && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.thumbnail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Video Details */}
        {uploadStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 2: Video Details</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter video title"
                    className="bg-gray-800 border-gray-700 mt-1"
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {categories.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {cat.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="language">Language *</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.language && (
                    <p className="text-red-500 text-sm mt-1">{errors.language}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="releaseYear">Release Year</Label>
                  <Input
                    id="releaseYear"
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    className="bg-gray-800 border-gray-700 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ageRating">Age Rating</Label>
                  <Select value={formData.ageRating} onValueChange={(value) => setFormData({ ...formData, ageRating: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                      <SelectValue placeholder="Select age rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {ageRatings.map((rating) => (
                        <SelectItem key={rating.value} value={rating.value}>
                          {rating.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Enter tags separated by commas"
                    className="bg-gray-800 border-gray-700 mt-1"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your content..."
                  className="bg-gray-800 border-gray-700 mt-1 min-h-[100px]"
                  maxLength={500}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="premium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                />
                <Label htmlFor="premium">Premium Content (Requires Subscription)</Label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setUploadStep(1)}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={isUploading} className="bg-red-600 hover:bg-red-700">
                {isUploading ? 'Uploading...' : 'Upload Content'}
              </Button>
            </div>
          </div>
        )}

        {/* Upload Success */}
        {uploadStep === 3 && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Successful!</h3>
            <p className="text-gray-400 mb-6">Your content is being processed and will be available soon.</p>
            <Button onClick={handleClose} className="bg-red-600 hover:bg-red-700">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}