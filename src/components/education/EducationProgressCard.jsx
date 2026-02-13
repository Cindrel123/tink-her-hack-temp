import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { GraduationCap, ArrowRight, BookOpen } from 'lucide-react'
import { educationService } from '@/services/educationService'
import { useAuth } from '@/hooks/useAuth'

export default function EducationProgressCard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({ completed: 0, total: 0, percentage: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return
            try {
                const [lessons, progress] = await Promise.all([
                    educationService.getLessons(),
                    educationService.getUserProgress(user.id)
                ])

                const completedCount = progress.filter(p => p.completed).length
                const totalCount = lessons.length

                setStats({
                    completed: completedCount,
                    total: totalCount,
                    percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                })
            } catch (e) {
                console.error("Failed to fetch education stats", e)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [user])

    if (loading) return null

    return (
        <Card className="card-nova border-none shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <GraduationCap className="h-24 w-24 text-malachite-600" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                    <BookOpen className="h-5 w-5 text-malachite-600" />
                    Financial Academy
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-3xl font-bold text-neutral-900">{stats.completed}</div>
                        <div className="text-xs text-neutral-500 font-medium">Lessons Completed</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-malachite-600">{Math.round(stats.percentage)}%</div>
                        <div className="text-xs text-neutral-500 font-medium">Mastery</div>
                    </div>
                </div>

                <div className="space-y-1">
                    <Progress value={stats.percentage} className="h-2 bg-neutral-100" indicatorColor="bg-malachite-500" />
                    <p className="text-xs text-neutral-400 text-center">
                        {stats.total - stats.completed} lessons until mastery
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Link to="/education" className="w-full">
                    <Button variant="outline" className="w-full justify-between hover:border-malachite-200 hover:text-malachite-700 hover:bg-malachite-50">
                        Continue Learning <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
