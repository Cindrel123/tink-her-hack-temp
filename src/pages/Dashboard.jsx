import { useState, useEffect } from 'react'
import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useGamification } from '@/hooks/useGamification'
import { useFinancialCalculator } from '@/hooks/useFinancialCalculator'
import LevelCard from '@/components/gamification/LevelCard'
import FinancialScoreCard from '@/components/gamification/FinancialScoreCard'
import BadgeGrid from '@/components/gamification/BadgeGrid'
import RewardDialog from '@/components/gamification/RewardDialog'
import FinancialPlanCard from '@/components/financial/FinancialPlanCard'

export default function Dashboard() {
    const { xp, level, score, badges, showReward, setShowReward, rewardMessage } = useGamification()
    const { financialPlan } = useFinancialCalculator()
    const [profile, setProfile] = useState({})

    useEffect(() => {
        const storedProfile = localStorage.getItem('financialProfile')
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile))
        }
    }, [])

    return (
        <MainLayout>
            <RewardDialog
                open={showReward}
                onOpenChange={setShowReward}
                title="Level Up!"
                message={rewardMessage}
            />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Welcome back to your financial journey.
                    </p>
                </div>

                {/* Gamification Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <LevelCard level={level} xp={xp} />
                    <FinancialScoreCard score={score} />
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Total XP
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{xp} XP</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Keep earning to level up!
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Financial Plan Section */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Your Financial Plan</h2>
                    <FinancialPlanCard financialPlan={financialPlan} profile={profile} />
                </div>

                {/* Badges Section */}
                <BadgeGrid userBadges={badges} />

                {/* Original Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-slate-500">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$2,350.00</div>
                            <p className="text-xs text-slate-500">+180.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4</div>
                            <p className="text-xs text-slate-500">2 nearing completion</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Challenges Won</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-slate-500">+2 from last month</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}
