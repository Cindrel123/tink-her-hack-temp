import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge as UiBadge } from '@/components/ui/badge'
import { Star, Trophy, Target, Award, ShieldCheck } from 'lucide-react'

export default function BadgeGrid({ userBadges }) {
    // Define all possible badges to show locked state
    const ALL_BADGES = [
        { name: 'Starter Planner', description: 'Created your first financial goal', icon: Star },
        { name: 'Wealth Explorer', description: 'Reached Level 3', icon: Trophy },
        { name: 'Consistency Pro', description: 'Completed 5 actions', icon: Award },
    ]

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {ALL_BADGES.map((badge) => {
                        const isUnlocked = userBadges.some(ub => ub.name === badge.name)
                        const Icon = badge.icon

                        return (
                            <div key={badge.name} className={`flex flex-col items-center p-4 rounded-lg border ${isUnlocked ? 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-50/50 border-slate-100 opacity-50 dark:bg-slate-900/50 dark:border-slate-800'}`}>
                                <div className={`p-2 rounded-full mb-2 ${isUnlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-400'}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h4 className="text-sm font-semibold text-center mb-1">{badge.name}</h4>
                                <p className="text-xs text-center text-slate-500">{badge.description}</p>
                                {isUnlocked && (
                                    <UiBadge variant="secondary" className="mt-2 text-[10px] px-1 py-0 h-4">Unlocked</UiBadge>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
