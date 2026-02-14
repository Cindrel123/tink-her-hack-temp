import { useState, useEffect } from 'react'
import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flame, CheckCircle, Calendar, Target, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useGamification } from '@/hooks/useGamification'
import { challengesService } from '@/services/challengesService'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

export default function Challenges() {
    const { user } = useAuth()
    const { streak, addXP } = useGamification()

    const [activeTab, setActiveTab] = useState('daily')
    const [challenges, setChallenges] = useState({ daily: [], weekly: [] })
    const [loading, setLoading] = useState(true)

    // Helper to simulate fetching Mock Data if DB is empty or fails
    const getMockChallenges = (type) => {
        if (type === 'daily') {
            return [
                { id: 'm1', title: 'Daily Login', description: 'Log in to the app today.', xp_reward: 10, type: 'daily', progress: 1, requirement_value: 1, completed: true },
                { id: 'm2', title: 'Quick Learner', description: 'Complete 1 lesson today.', xp_reward: 20, type: 'daily', progress: 0, requirement_value: 1, completed: false },
                { id: 'm3', title: 'Financial Check', description: 'Review your budget.', xp_reward: 15, type: 'daily', progress: 0, requirement_value: 1, completed: false }
            ]
        }
        return [
            { id: 'w1', title: 'Savvy Saver', description: 'Save $50 this week.', xp_reward: 50, type: 'weekly', progress: 20, requirement_value: 50, completed: false },
            { id: 'w2', title: 'Knowledge Buff', description: 'Complete 3 lessons.', xp_reward: 60, type: 'weekly', progress: 1, requirement_value: 3, completed: false }
        ]
    }

    useEffect(() => {
        const fetchChallenges = async () => {
            setLoading(true)
            if (user) {
                const daily = await challengesService.getChallenges(user.id, 'daily')
                const weekly = await challengesService.getChallenges(user.id, 'weekly')

                // Fallback to mock if API returns empty (for demo purposes if DB not seeded)
                setChallenges({
                    daily: daily.length ? daily : getMockChallenges('daily'),
                    weekly: weekly.length ? weekly : getMockChallenges('weekly')
                })
            } else {
                // Mock for unauthenticated (layout preview)
                setChallenges({
                    daily: getMockChallenges('daily'),
                    weekly: getMockChallenges('weekly')
                })
            }
            setLoading(false)
        }

        fetchChallenges()
    }, [user])

    const handleSimulateProgress = async (challenge) => {
        if (challenge.completed) return

        // Simulate progress increment (in real app, this happens via actions)
        const newProgress = challenge.progress + 1
        // Optimistic UI Update
        const updatedList = challenges[activeTab].map(c =>
            c.id === challenge.id ? { ...c, progress: newProgress, completed: newProgress >= challenge.requirement_value } : c
        )
        setChallenges(prev => ({ ...prev, [activeTab]: updatedList }))

        // Call Service
        if (user) {
            await challengesService.updateProgress(user.id, challenge.id, 1, challenge.requirement_value)
        }

        // Check completion
        if (newProgress >= challenge.requirement_value) {
            triggerCompletion(challenge)
        } else {
            toast.success("Progress Updated!")
        }
    }

    const triggerCompletion = (challenge) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
        toast.success(`Challenge Completed! +${challenge.xp_reward} XP`)
        addXP(challenge.xp_reward)
    }

    const renderChallengeCard = (challenge) => {
        const progressPercent = Math.min((challenge.progress / challenge.requirement_value) * 100, 100)

        return (
            <Card key={challenge.id} className={`transition-all duration-300 ${challenge.completed ? 'border-malachite-200 bg-malachite-50/30' : 'hover:shadow-md'}`}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                {challenge.title}
                                {challenge.completed && <CheckCircle className="h-5 w-5 text-malachite-600" />}
                            </CardTitle>
                            <CardDescription>{challenge.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">
                            +{challenge.xp_reward} XP
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-neutral-600">
                            <span>Progress</span>
                            <span className="font-medium">{challenge.progress} / {challenge.requirement_value}</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" indicatorColor={challenge.completed ? "bg-malachite-600" : "bg-neutral-900"} />

                        {!challenge.completed && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-4"
                                onClick={() => handleSimulateProgress(challenge)}
                            >
                                Mark Progress
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Challenges</h1>
                        <p className="text-neutral-500 mt-2">
                            Complete daily and weekly tasks to earn XP and build healthy habits.
                        </p>
                    </div>

                    {/* Streak Card */}
                    <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-sm min-w-[200px]">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-full">
                                <Flame className={`h-6 w-6 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-neutral-400'}`} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-neutral-900">{streak} Day{streak !== 1 && 's'}</div>
                                <div className="text-xs text-orange-600 font-medium uppercase tracking-wider">Daily Streak</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'daily'
                                ? 'bg-white text-neutral-900 shadow-sm'
                                : 'text-neutral-500 hover:text-neutral-900'
                            }`}
                    >
                        Daily Challenges
                    </button>
                    <button
                        onClick={() => setActiveTab('weekly')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'weekly'
                                ? 'bg-white text-neutral-900 shadow-sm'
                                : 'text-neutral-500 hover:text-neutral-900'
                            }`}
                    >
                        Weekly Challenges
                    </button>
                </div>

                {/* Challenges Grid */}
                {loading ? (
                    <div className="text-center py-12 text-neutral-500">Loading challenges...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {challenges[activeTab].map(renderChallengeCard)}

                        {challenges[activeTab].length === 0 && (
                            <div className="col-span-full text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl">
                                <Trophy className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-neutral-900">All caught up!</h3>
                                <p className="text-neutral-500">Check back later for more challenges.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
