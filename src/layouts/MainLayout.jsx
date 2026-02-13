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
                "h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-300 relative group",
                isActive
                    ? "bg-malachite-600 text-white shadow-lg shadow-malachite-200 scale-110"
                    : "text-neutral-400 hover:text-malachite-600 hover:bg-malachite-50 hover:scale-105"
            )}>
                <item.icon className="h-6 w-6" />
                {/* Tooltip-like label */}
                <div className={cn(
                    "absolute opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50",
                    // Position based on layout (right for desktop, top for mobile)
                    "left-14 top-1/2 -translate-y-1/2 bg-neutral-900/90 backdrop-blur-sm hidden lg:block", // Desktop
                    "-top-10 left-1/2 -translate-x-1/2 lg:hidden" // Mobile
                )}>
                    {item.label}
                </div>
            </div>
        </Link>
    )

    return (
        <div className="min-h-screen bg-neutral-50 font-sans selection:bg-malachite-100 selection:text-malachite-900 pb-24 lg:pb-0">

            {/* FLOATING NAVBAR */}
            <nav className="fixed z-50 transition-all duration-500 ease-out
                /* Desktop: Vertical Left Center */
                lg:left-6 lg:top-1/2 lg:-translate-y-1/2 lg:w-20 lg:h-auto lg:flex-col
                /* Mobile: Horizontal Bottom Center */
                bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 flex-row
                
                bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-neutral-200/50 rounded-3xl flex items-center justify-between p-4 lg:py-6
            ">

                {/* Logo / Brand Icon (Desktop Top) */}
                <div className="hidden lg:flex items-center justify-center mb-6 w-full">
                    <div className="h-10 w-10 bg-malachite-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-malachite-200">
                        <LayoutDashboard className="h-5 w-5" />
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex flex-row lg:flex-col items-center justify-around w-full gap-2 lg:gap-6">
                    {navItems.map((item) => (
                        <NavIcon
                            key={item.path}
                            item={item}
                            isActive={location.pathname === item.path}
                        />
                    ))}

                    {/* Divider for Mobile (Hidden) / Visible for Desktop */}
                    <div className="hidden lg:block w-8 h-[1px] bg-neutral-200 my-2"></div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="h-12 w-12 flex items-center justify-center rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                    >
                        <LogOut className="h-6 w-6" />
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="transition-all duration-300 min-h-screen">
                {/* Desktop Header (Simplified) */}
                <header className="hidden lg:flex h-20 px-8 lg:pl-32 items-center justify-between sticky top-0 z-20 bg-neutral-50/80 backdrop-blur-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 capitalize tracking-tight">
                            {location.pathname.split('/')[1] || 'Dashboard'}
                        </h2>
                        <p className="text-sm text-neutral-500 font-medium">Manage your financial lifestyle</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-neutral-200 shadow-sm">
                            <div className="h-8 w-8 rounded-full bg-malachite-100 flex items-center justify-center text-malachite-700 font-bold text-xs ring-2 ring-white">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm font-medium text-neutral-700 pr-2">
                                {user?.email?.split('@')[0] || 'User'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="container mx-auto p-4 lg:p-8 lg:pl-32 max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {children}
                </div>
            </main>
        </div>
    )
}
