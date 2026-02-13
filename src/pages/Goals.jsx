import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, TrendingUp, Calendar, Target } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useGamification } from '@/hooks/useGamification'
import { useFinancialCalculator } from '@/hooks/useFinancialCalculator'
import RewardDialog from '@/components/gamification/RewardDialog'

export default function Goals() {
    const { user } = useAuth()
    const { addXP, unlockBadge, showReward, setShowReward, rewardMessage } = useGamification()
    const { generateFinancialPlan } = useFinancialCalculator()
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [createOpen, setCreateOpen] = useState(false)
    const [updateOpen, setUpdateOpen] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState(null)
    const [amountToAdd, setAmountToAdd] = useState('')

    // New Goal Form State
    const [newGoal, setNewGoal] = useState({
        name: '',
        amount: '',
        date: ''
    })

    // Load Goals
    useEffect(() => {
        fetchGoals()
    }, [])

    const fetchGoals = async () => {
        setLoading(true)
        try {
            // Mock Data Fetch
            const storedGoals = localStorage.getItem('financialGoals')
            if (storedGoals) {
                setGoals(JSON.parse(storedGoals))
            } else {
                // Placeholder for real fetch
                setGoals([])
            }
        } catch (error) {
            console.error('Error fetching goals:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateGoal = async () => {
        console.log('Create Goal clicked', newGoal)

        if (!newGoal.name || !newGoal.amount || !newGoal.date) {
            console.log('Validation failed:', { name: newGoal.name, amount: newGoal.amount, date: newGoal.date })
            alert('Please fill in all fields')
            return
        }

        const goal = {
            id: crypto?.randomUUID ? crypto.randomUUID() : `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            user_id: user?.id || 'mock-id-123',
            goal_name: newGoal.name,
            target_amount: Number(newGoal.amount),
            current_amount: 0,
            target_date: newGoal.date,
            created_at: new Date().toISOString()
        }

        console.log('Creating goal:', goal)

        // Update Local State
        const updatedGoals = [...goals, goal]
        setGoals(updatedGoals)
        localStorage.setItem('financialGoals', JSON.stringify(updatedGoals))

        // Reset & Close
        setNewGoal({ name: '', amount: '', date: '' })
        setCreateOpen(false)

        // Award XP and Badge
        console.log('Awarding XP...')
        addXP(40)
        if (updatedGoals.length === 1) {
            unlockBadge('Starter Planner', 'Created your first financial goal')
        }

        // Recalculate financial plan with new goal
        generateFinancialPlan()

        console.log('Goal created successfully!')
    }

    const handleUpdateProgress = async () => {
        if (!selectedGoal || !amountToAdd) return

        const updatedGoals = goals.map(g => {
            if (g.id === selectedGoal.id) {
                return { ...g, current_amount: Number(g.current_amount) + Number(amountToAdd) }
            }
            return g
        })

        setGoals(updatedGoals)
        localStorage.setItem('financialGoals', JSON.stringify(updatedGoals))

        // Award XP for updating savings
        addXP(25)

        // Recalculate financial plan with updated goal
        generateFinancialPlan()

        setAmountToAdd('')
        setUpdateOpen(false)
        setSelectedGoal(null)
    }

    const handleDeleteGoal = async (id) => {
        if (!confirm("Are you sure you want to delete this goal?")) return

        const updatedGoals = goals.filter(g => g.id !== id)
        setGoals(updatedGoals)
        localStorage.setItem('financialGoals', JSON.stringify(updatedGoals))
    }

    return (
        <MainLayout>
            <RewardDialog
                open={showReward}
                onOpenChange={setShowReward}
                title="Level Up!"
                message={rewardMessage}
            />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Set targets and track your journey to financial freedom.
                        </p>
                    </div>

                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Goal
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Goal</DialogTitle>
                                <DialogDescription>
                                    Define your target. What are you saving for?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Goal Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Dream House"
                                        value={newGoal.name}
                                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Target Amount ($)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="50000"
                                        value={newGoal.amount}
                                        onChange={(e) => setNewGoal({ ...newGoal, amount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Target Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newGoal.date}
                                        onChange={(e) => setNewGoal({ ...newGoal, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateGoal}>Create Goal</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading goals...</div>
                ) : goals.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <Target className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium">No goals yet</h3>
                        <p className="text-slate-500 mb-4">Create your first financial goal to get started.</p>
                        <Button variant="outline" onClick={() => setCreateOpen(true)}>Create Goal</Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {goals.map((goal) => {
                            const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
                            const remaining = goal.target_amount - goal.current_amount
                            const daysRemaining = Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24))
                            const isAchieved = progress >= 100

                            return (
                                <Card key={goal.id} className="flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                    {isAchieved && (
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <Target className="h-24 w-24 text-green-500" />
                                        </div>
                                    )}
                                    <CardHeader className="pb-3 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">{goal.goal_name}</CardTitle>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
                                            </div>
                                            {isAchieved ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">Achieved 🎉</Badge>
                                            ) : (
                                                <Badge variant="outline" className={daysRemaining < 30 ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"}>
                                                    {daysRemaining > 0 ? `${daysRemaining} days left` : 'Due'}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6 flex-1 relative z-10">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">Progress</span>
                                                <span className={cn("font-bold", isAchieved ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400")}>{progress.toFixed(0)}%</span>
                                            </div>
                                            <Progress
                                                value={progress}
                                                className="h-3 bg-slate-100 dark:bg-slate-800"
                                                indicatorColor={isAchieved ? "bg-green-500" : progress > 50 ? "bg-blue-500" : "bg-blue-400"}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <div>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">Target</p>
                                                <p className="font-bold text-lg text-slate-900 dark:text-slate-100">${Number(goal.target_amount).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">Saved</p>
                                                <p className={cn("font-bold text-lg", isAchieved ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400")}>
                                                    ${Number(goal.current_amount).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {!isAchieved && (
                                            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                                                <span className="font-semibold text-slate-700 dark:text-slate-200">${remaining.toLocaleString()}</span> to go!
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-4 border-t bg-slate-50/50 flex gap-2 relative z-10">
                                        <Dialog open={updateOpen && selectedGoal?.id === goal.id} onOpenChange={(open) => {
                                            setUpdateOpen(open)
                                            if (!open) setSelectedGoal(null)
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className={cn("flex-1 font-semibold", isAchieved ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700")}
                                                    onClick={() => setSelectedGoal(goal)}
                                                    disabled={isAchieved}
                                                >
                                                    <TrendingUp className="mr-2 h-4 w-4" />
                                                    {isAchieved ? "Completed" : "Add Funds"}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Update Savings</DialogTitle>
                                                    <DialogDescription>
                                                        Add funds to <strong>{goal.goal_name}</strong>
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Amount to Add ($)</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="100"
                                                            value={amountToAdd}
                                                            onChange={(e) => setAmountToAdd(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleUpdateProgress}>Update Progress</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                                            onClick={() => handleDeleteGoal(goal.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
