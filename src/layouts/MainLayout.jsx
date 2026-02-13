import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LayoutDashboard, Target, GraduationCap, Trophy, User, Menu, LogOut } from 'lucide-react'

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: GraduationCap, label: 'Education', path: '/education' },
    { icon: Trophy, label: 'Challenges', path: '/challenges' },
    { icon: User, label: 'Profile', path: '/profile' },
]

export default function MainLayout({ children }) {
    const location = useLocation()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Finance Mentor
                </h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justification-start gap-3 transition-all",
                                    isActive && "bg-slate-100 text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    )
                })}
            </nav>
            <div className="p-6 mt-auto border-t space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="text-sm overflow-hidden">
                        <p className="font-medium truncate">{user?.email?.split('@')[0] || 'User'}</p>
                        <p className="text-slate-500 text-xs truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 border-r bg-white dark:bg-slate-950 dark:border-slate-800 fixed h-full z-30">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 px-4 flex items-center justify-between dark:bg-slate-950 dark:border-slate-800">
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Finance Mentor
                </h1>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen">
                <div className="container mx-auto p-4 lg:p-8 max-w-7xl animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
