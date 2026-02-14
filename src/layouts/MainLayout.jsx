import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Target, GraduationCap, Trophy, User, LogOut, Menu } from 'lucide-react'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: GraduationCap, label: 'Education', path: '/education' },
    { icon: Trophy, label: 'Challenges', path: '/challenges' },
    { icon: User, label: 'Profile', path: '/profile' },
]

export default function MainLayout({ children }) {
    const location = useLocation()
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    const NavIcon = ({ item, isActive }) => (
        <Link to={item.path} title={item.label}>
            <div className={cn(
                "h-12 w-12 flex items-center justify-center rounded-2xl transition-all duration-500 ease-out relative group",
                isActive
                    ? "bg-malachite-600 text-white shadow-lg shadow-malachite-300/50 scale-110"
                    : "text-malachite-400 hover:text-malachite-600 hover:bg-malachite-50/80 hover:scale-105 active:scale-95"
            )}>
                <item.icon className={cn(
                    "h-5 w-5 transition-all duration-500 ease-out",
                    isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"
                )} />

                {/* Tooltip - Positioned above navbar */}
                <div className={cn(
                    "absolute -top-12 left-1/2 -translate-x-1/2",
                    "opacity-0 group-hover:opacity-100 group-hover:-translate-y-1",
                    "transition-all duration-300 ease-out",
                    "bg-malachite-950/95 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg",
                    "whitespace-nowrap pointer-events-none z-50",
                    "shadow-lg shadow-malachite-950/20"
                )}>
                    {item.label}
                    {/* Arrow pointing down */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-malachite-950/95 rotate-45"></div>
                </div>
            </div>
        </Link>
    )

    return (
        <div className="min-h-screen bg-malachite-200/50 font-sans selection:bg-malachite-100 selection:text-malachite-900 pb-28">

            {/* FLOATING NAVBAR - CENTERED AT BOTTOM */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                w-[90%] max-w-md
                bg-white/95 backdrop-blur-xl 
                border border-malachite-200/50 
                shadow-2xl shadow-malachite-900/10 
                rounded-full 
                px-6 py-4
                transition-all duration-500 ease-out
                hover:shadow-3xl hover:scale-[1.02]
            ">
                {/* Navigation Items */}
                <div className="flex flex-row items-center justify-around gap-2">
                    {navItems.map((item) => (
                        <NavIcon
                            key={item.path}
                            item={item}
                            isActive={location.pathname === item.path}
                        />
                    ))}

                    {/* Divider */}
                    <div className="h-8 w-[1px] bg-malachite-200"></div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="h-12 w-12 flex items-center justify-center rounded-xl 
                            text-malachite-400 hover:text-malachite-900 hover:bg-malachite-100 
                            transition-all duration-300 ease-out
                            hover:scale-110 active:scale-95"
                    >
                        <LogOut className="h-5 w-5 transition-transform duration-300" />
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="transition-all duration-300 min-h-screen">
                {/* Desktop Header (Simplified) */}
                <header className="hidden lg:flex h-20 px-8 items-center justify-between sticky top-0 z-20 bg-malachite-50/80 backdrop-blur-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-malachite-950 capitalize tracking-tight">
                            {location.pathname.split('/')[1] || 'Dashboard'}
                        </h2>
                        <p className="text-sm text-malachite-500 font-medium">Manage your financial lifestyle</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-neutral-200 shadow-sm">
                            <div className="h-8 w-8 rounded-full bg-malachite-100 flex items-center justify-center text-malachite-700 font-bold text-xs ring-2 ring-white">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm font-medium text-malachite-700 pr-2">
                                {user?.email?.split('@')[0] || 'User'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="container mx-auto p-4 lg:p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {children}
                </div>
            </main>
        </div>
    )
}
