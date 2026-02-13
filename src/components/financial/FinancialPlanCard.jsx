import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, PiggyBank, AlertCircle, Target } from 'lucide-react'

export default function FinancialPlanCard({ financialPlan, profile }) {
    const { emergencyFund, monthlyInvestmentRequired, budgetNeeds, budgetWants, budgetSavings } = financialPlan
    const currentSavings = profile?.savings || 0

    // Calculate emergency fund progress
    const emergencyFundProgress = emergencyFund > 0 ? Math.min((currentSavings / emergencyFund) * 100, 100) : 0

    // Calculate budget usage percentages (Mock data for visualization)
    const needsPercent = 50
    const wantsPercent = 20
    const savingsPercent = 30

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* 1. Emergency Fund Card */}
            <Card className="card-nova border-none shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertCircle className="h-16 w-16 text-orange-500" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-neutral-500">
                        Emergency Fund Goal
                    </CardTitle>
                    <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-neutral-900">
                        ${emergencyFund.toLocaleString()}
                    </div>
                    <Progress
                        value={emergencyFundProgress}
                        className="h-2 mt-3 mb-2 bg-orange-100"
                        indicatorColor={emergencyFundProgress >= 100 ? "bg-malachite-500" : "bg-orange-500"}
                    />
                    <p className="text-xs text-neutral-500">
                        {emergencyFundProgress.toFixed(0)}% funded (${currentSavings.toLocaleString()} saved)
                    </p>
                </CardContent>
            </Card>

            {/* 2. Monthly Investment Required */}
            <Card className="card-nova border-none shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp className="h-16 w-16 text-blue-500" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-neutral-500">
                        Monthly Investment
                    </CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-neutral-900">
                        ${monthlyInvestmentRequired.toLocaleString()}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                        Required to reach your long-term goals
                    </p>
                </CardContent>
            </Card>

            {/* 3. Recommended Savings */}
            <Card className="card-nova border-none shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PiggyBank className="h-16 w-16 text-malachite-500" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-neutral-500">
                        Target Savings
                    </CardTitle>
                    <div className="h-8 w-8 rounded-full bg-malachite-50 flex items-center justify-center text-malachite-600">
                        <PiggyBank className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-neutral-900">
                        ${budgetSavings.toLocaleString()}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                        Recommended 30% of monthly income
                    </p>
                </CardContent>
            </Card>

            {/* 4. Budget Breakdown */}
            <Card className="card-nova border-none shadow-sm md:col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-neutral-500 flex items-center justify-between">
                        Budget Rules (50/30/20)
                        <Target className="h-4 w-4 text-purple-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    {/* Needs */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="font-medium text-neutral-600">Needs</span>
                            <span className="text-neutral-900">${budgetNeeds.toLocaleString()} (50%)</span>
                        </div>
                        <Progress value={needsPercent} className="h-1.5 bg-neutral-100" indicatorColor="bg-neutral-800" />
                    </div>

                    {/* Wants */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="font-medium text-neutral-600">Wants</span>
                            <span className="text-neutral-900">${budgetWants.toLocaleString()} (20%)</span>
                        </div>
                        <Progress value={wantsPercent} className="h-1.5 bg-neutral-100" indicatorColor="bg-purple-500" />
                    </div>

                    {/* Savings */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="font-medium text-neutral-600">Savings</span>
                            <span className="text-malachite-700 font-bold">${budgetSavings.toLocaleString()} (30%)</span>
                        </div>
                        <Progress value={savingsPercent} className="h-1.5 bg-malachite-100" indicatorColor="bg-malachite-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
