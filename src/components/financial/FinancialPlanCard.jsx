import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DollarSign, TrendingUp, PiggyBank, AlertCircle } from 'lucide-react'

export default function FinancialPlanCard({ financialPlan, profile }) {
    const { emergencyFund, monthlyInvestmentRequired, budgetNeeds, budgetWants, budgetSavings } = financialPlan
    const currentSavings = profile?.savings || 0
    const income = profile?.income || 1

    // Calculate emergency fund progress
    const emergencyFundProgress = emergencyFund > 0 ? Math.min((currentSavings / emergencyFund) * 100, 100) : 0

    // Calculate budget usage percentages
    const needsPercent = 50
    const wantsPercent = 20
    const savingsPercent = 30

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Emergency Fund Card */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Emergency Fund Goal
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        ${emergencyFund.toLocaleString()}
                    </div>
                    <Progress
                        value={emergencyFundProgress}
                        className="h-2 mt-3 mb-2"
                        indicatorColor={emergencyFundProgress >= 100 ? "bg-green-500" : "bg-orange-500"}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {emergencyFundProgress.toFixed(0)}% funded (${currentSavings.toLocaleString()} saved)
                    </p>
                </CardContent>
            </Card>

            {/* Monthly Investment Required */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Monthly Investment Needed
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${monthlyInvestmentRequired.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        To reach all your goals on time
                    </p>
                </CardContent>
            </Card>

            {/* Recommended Savings */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Recommended Savings
                    </CardTitle>
                    <PiggyBank className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${budgetSavings.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        30% of your income
                    </p>
                </CardContent>
            </Card>

            {/* Budget Breakdown - Spans full width on mobile, 3 cols on desktop */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Budget Allocation (50/30/20 Rule)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Needs */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">Needs (50%)</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">${budgetNeeds.toLocaleString()}</span>
                            </div>
                            <Progress value={needsPercent} className="h-2" indicatorColor="bg-red-500" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Essentials: rent, utilities, groceries
                            </p>
                        </div>

                        {/* Wants */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">Wants (20%)</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">${budgetWants.toLocaleString()}</span>
                            </div>
                            <Progress value={wantsPercent} className="h-2" indicatorColor="bg-yellow-500" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Entertainment, dining out, hobbies
                            </p>
                        </div>

                        {/* Savings */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">Savings (30%)</span>
                                <span className="font-bold text-green-600 dark:text-green-400">${budgetSavings.toLocaleString()}</span>
                            </div>
                            <Progress value={savingsPercent} className="h-2" indicatorColor="bg-green-500" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Investments, emergency fund, goals
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
