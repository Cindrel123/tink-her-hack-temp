import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy } from 'lucide-react'

export default function LevelCard({ level, xp }) {
    // Current Level thresholds
    const LEVELS = [0, 100, 300, 700, 1500, 3000, 5000, 8000, 12000, 20000]
    const currentThreshold = LEVELS[level - 1] || 0
    const nextThreshold = LEVELS[level] || 100000

    // Calculate progress within current level
    const progressInLevel = xp - currentThreshold
    const totalInLevel = nextThreshold - currentThreshold
    const progressPercent = Math.min((progressInLevel / totalInLevel) * 100, 100)

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                    Current Level
                </CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900 mb-2">Level {level}</div>
                <Progress value={progressPercent} className="h-2 mb-2" indicatorColor="bg-yellow-500" />
                <p className="text-xs text-slate-500">
                    {xp} / {nextThreshold} XP to Level {level + 1}
                </p>
            </CardContent>
        </Card>
    )
}
