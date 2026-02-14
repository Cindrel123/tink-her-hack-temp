import { useState, useEffect } from 'react'
import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useGamification } from '@/hooks/useGamification'
import { User, Mail, Shield, Save, Camera } from 'lucide-react'
import { toast } from 'sonner'

export default function Profile() {
    const { user } = useAuth()
    const { level, xp } = useGamification()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(user?.email?.split('@')[0] || 'User')

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate save
        setTimeout(() => {
            setLoading(false)
            toast.success("Profile updated successfully!")
        }, 1000)
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-malachite-950 tracking-tight">Your Profile</h1>
                    <p className="text-malachite-600 font-medium">Manage your identity and app preferences.</p>
                </div>

                {/* Profile Card */}
                <Card className="border-malachite-100 shadow-xl shadow-malachite-900/5 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-malachite-600 to-malachite-500 text-white p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl border-2 border-white/30 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <button className="absolute -bottom-2 -right-2 h-8 w-8 bg-white text-malachite-600 rounded-xl shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-center md:text-left space-y-1">
                                <CardTitle className="text-2xl font-bold">{name}</CardTitle>
                                <CardDescription className="text-malachite-100 font-medium flex items-center gap-2 justify-center md:justify-start">
                                    <Mail className="h-3.5 w-3.5" />
                                    {user?.email}
                                </CardDescription>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                                        Level {level}
                                    </span>
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                                        {xp} XP Earned
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-malachite-900 font-bold ml-1">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-malachite-400" />
                                        <Input
                                            id="fullName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-10 border-malachite-100 focus-visible:ring-malachite-500 rounded-xl bg-malachite-50/30"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-malachite-900 font-bold ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-malachite-400" />
                                        <Input
                                            id="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="pl-10 border-malachite-100 bg-malachite-50/50 rounded-xl text-malachite-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[10px] text-malachite-400 font-medium ml-1 flex items-center gap-1">
                                        <Shield className="h-3 w-3" /> Managed via Supabase Auth
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full h-12 bg-malachite-600 hover:bg-malachite-700 text-white rounded-2xl shadow-lg shadow-malachite-200 font-bold gap-2 transition-all active:scale-[0.98]"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            Update Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Account Settings Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6 border-malachite-50 bg-white/50 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                        <div className="h-10 w-10 rounded-xl bg-malachite-100 flex items-center justify-center text-malachite-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-malachite-950">Security Settings</h3>
                        <p className="text-xs text-malachite-500">Enable 2FA and manage sessions.</p>
                    </Card>
                    <Card className="p-6 border-malachite-50 bg-white/50 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                        <div className="h-10 w-10 rounded-xl bg-malachite-100 flex items-center justify-center text-malachite-600">
                            <Mail className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-malachite-950">Email Preferences</h3>
                        <p className="text-xs text-malachite-500">Manage your newsletter and alerts.</p>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}
