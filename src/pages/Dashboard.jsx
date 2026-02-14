import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import AIAdviceCard from '@/components/dashboard/AIAdviceCard'
import { useGamification } from '@/hooks/useGamification'
import { useFinancialCalculator } from '@/hooks/useFinancialCalculator'
import LevelCard from '@/components/gamification/LevelCard'
import FinancialScoreCard from '@/components/gamification/FinancialScoreCard'
import BadgeGrid from '@/components/gamification/BadgeGrid'
import RewardDialog from '@/components/gamification/RewardDialog'
import FinancialPlanCard from '@/components/financial/FinancialPlanCard'
import EducationProgressCard from '@/components/education/EducationProgressCard'
import { DollarSign, TrendingUp, PiggyBank, Target, Trophy, Zap, Flame } from 'lucide-react'

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { xp, level, score, badges, showReward, setShowReward, rewardMessage, streak } = useGamification()
    const { financialPlan } = useFinancialCalculator()
    const [goals, setGoals] = useState([])
    const [profile, setProfile] = useState({})

    useEffect(() => {
        const storedProfile = localStorage.getItem('financialProfile')
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile))
        }

        const storedGoals = localStorage.getItem('financialGoals')
        if (storedGoals) {
            setGoals(JSON.parse(storedGoals))
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

            <div className="space-y-8">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-malachite-950">Overview</h1>
                    <p className="text-malachite-500 mt-2">
                        Here's what's happening with your finance today.
                    </p>
                </div>

                {/* 1. Top Row: Quick Stats (Bento Row 1) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat 1 */}
                    <Card className="card-nova border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-malachite-500">Total Balance</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-malachite-50 flex items-center justify-center text-malachite-600">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-malachite-950">$45,231.89</div>
                            <p className="text-xs text-malachite-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>

                    {/* Stat 2 */}
                    <Card className="card-nova border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-malachite-500">Monthly Savings</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-malachite-50 flex items-center justify-center text-malachite-600">
                                <PiggyBank className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-malachite-950">$2,350.00</div>
                            <p className="text-xs text-malachite-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +4% from last month
                            </p>
                        </CardContent>
                    </Card>

                    {/* Stat 3 */}
                    <Card className="card-nova border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-malachite-500">Active Goals</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-malachite-50 flex items-center justify-center text-malachite-600">
                                <Target className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-malachite-950">4</div>
                            <p className="text-xs text-malachite-500 mt-1">2 nearing completion</p>
                        </CardContent>
                    </Card>

                    {/* Stat 4 - REPLACED with Streak */}
                    <Card className="card-nova border-none shadow-sm bg-malachite-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-malachite-700">Daily Streak</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-malachite-100 flex items-center justify-center text-malachite-600">
                                <Flame className={`h-4 w-4 ${streak > 0 ? 'animate-pulse' : ''}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-malachite-950">{streak} Days</div>
                            <p className="text-xs text-malachite-600 flex items-center mt-1">
                                <Zap className="h-3 w-3 mr-1" />
                                Keep it up for 2x XP!
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN (Wide) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Financial Plan Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-malachite-900">Financial Health</h2>
                                <Button variant="ghost" className="text-malachite-600 hover:text-malachite-700 hover:bg-malachite-50 text-sm">
                                    View Detailed Report
                                </Button>
                            </div>
                            <FinancialPlanCard financialPlan={financialPlan} profile={profile} />
                        </section>

                        {/* AI Advisor Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-malachite-900">AI Mentor Insights</h2>
                            </div>
                            <AIAdviceCard
                                userId={user?.id}
                                userProfile={profile}
                                userGoals={goals}
                                userGamification={{ level, score }}
                                userPlan={financialPlan}
                            />
                        </section>
                    </div>

                    {/* RIGHT COLUMN (Narrow) */}
                    <div className="lg:col-span-4 space-y-8">


                        {/* Daily Challenge Widget */}
                        <Card className="bg-white border-malachite-200 border-2 shadow-md transform transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer" onClick={() => navigate('/challenges')}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2 text-malachite-950">
                                    <div className="h-8 w-8 rounded-full bg-malachite-100 flex items-center justify-center">
                                        <Target className="h-5 w-5 text-malachite-600" />
                                    </div>
                                    Daily Challenge
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-malachite-600 text-sm mb-4">Complete your daily login and check your budget.</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold bg-malachite-100 text-malachite-700 px-3 py-1 rounded-full border border-malachite-200">+10 XP Reward</span>
                                    <Button size="sm" className="h-8 bg-malachite-600 hover:bg-malachite-700 text-white">Start</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education Progress Widget */}
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <EducationProgressCard />
                        </div>

                        {/* Gamification Status */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold text-malachite-900">Your Progress</h2>

                            {/* Level Card */}
                            <div className="transform transition-all duration-300 hover:scale-[1.02]">
                                <LevelCard level={level} xp={xp} />
                            </div>

                            {/* Financial Score */}
                            <div className="transform transition-all duration-300 hover:scale-[1.02]">
                                <FinancialScoreCard score={score} />
                            </div>
                        </section>

                        {/* Recent Badges */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-malachite-900">Recent Badges</h2>
                                <Button variant="link" className="text-malachite-600 h-auto p-0">View All</Button>
                            </div>
                            <div className="bg-white rounded-xl border border-malachite-200 p-4 shadow-sm">
                                <BadgeGrid userBadges={badges.slice(0, 4)} />
                            </div>
                        </section>

                        {/* Upgrade / Promo Card (Common in dashboard designs) */}
                        <div className="bg-gradient-to-br from-malachite-900 to-malachite-950 rounded-2xl p-6 text-white text-center space-y-4 shadow-lg">
                            <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                                <Zap className="h-6 w-6 text-malachite-700" />
                            </div>
                            <h3 className="font-bold text-lg">Go Premium</h3>
                            <p className="text-malachite-400 text-sm">Unlock advanced AI insights and unlimited goal tracking.</p>
                            <Button className="w-full bg-white text-malachite-950 hover:bg-malachite-100 border-none">
                                Upgrade Plan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
