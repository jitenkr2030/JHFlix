'use client'

import { useState } from 'react'
import { X, Mail, Phone, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('phone')
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: ''
  })
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      })

      const data = await response.json()
      if (response.ok) {
        setOtpSent(true)
        if (data.otp) {
          alert(`Demo OTP: ${data.otp}`)
        }
      } else {
        alert(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginType === 'email' ? formData.email : formData.phone,
          password: formData.password,
          otp: formData.otp,
          loginType
        })
      })

      const data = await response.json()
      if (response.ok) {
        alert('Login successful!')
        onClose()
        // In production, store user session/token
        console.log('Logged in user:', data.user)
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to JHFlix</DialogTitle>
        </DialogHeader>
        
        <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'email' | 'phone')}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="phone" className="data-[state=active]:bg-red-600">
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-red-600">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                maxLength={10}
              />
            </div>

            {!otpSent ? (
              <Button 
                onClick={handleSendOTP}
                disabled={isLoading || formData.phone.length !== 10}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit code"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    maxLength={6}
                  />
                </div>
                <Button 
                  onClick={handleLogin}
                  disabled={isLoading || formData.otp.length !== 6}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setOtpSent(false)}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Change Phone Number
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button 
              onClick={handleLogin}
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="text-center text-sm text-gray-400">
              Don't have an account? <button className="text-red-500 hover:underline">Sign up</button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}