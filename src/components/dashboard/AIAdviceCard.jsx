import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getLatestAdvice, generateFinancialAdvice } from '@/services/aiService'
import ReactMarkdown from 'react-markdown'
import { Loader2, RefreshCw, Zap } from 'lucide-react'

// Mock Data for fallback if user is not authenticated or no data
const MOCK_ADVICE = `
**Budget Improvement:**
Start tracking every small expense. Reduce dining out to twice a week.

**Savings Optimization:**
Aim for a 20% savings rate. Your emergency fund looks solid but could be increased slightly.

**Investment Recommendations:**
Consider low-cost index funds for long-term growth. Diversify your portfolio.

**Goal Strategy:**
Prioritize high-interest debt repayment first. Automate your savings for the "New Car" goal.

**Motivation:**
"Compound interest is the eighth wonder of the world. Start early!" 🚀
`

export default function AIAdviceCard({ userId, userProfile, userGoals, userGamification, userPlan }) {
    const [advice, setAdvice] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fallback ID if auth is just local mock
    const effectiveUserId = userId || 'mock-user-id'

    // Load latest advice on mount
    useEffect(() => {
        if (effectiveUserId) {
            loadAdvice()
        }
    }, [effectiveUserId])

    const loadAdvice = async () => {
        try {
            setLoading(true)
            const { data, error } = await getLatestAdvice(effectiveUserId)
            if (data && data.advice_text) {
                setAdvice(data.advice_text)
            } else {
                // If no existing advice, maybe generate one automatically?
                // Or just show placeholder.
                // For now, leave null or show prompt to generate.
            }
        } catch (err) {
            console.error("Failed to load advice:", err)
            // Silently fail or show error
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async () => {
        setLoading(true)
        setError(null)
        try {
            const userData = {
                profile: userProfile,
                goals: userGoals,
                gamification: userGamification,
                plan: userPlan
            }
            const newAdvice = await generateFinancialAdvice(effectiveUserId, userData)
            setAdvice(newAdvice)
        } catch (err) {
            console.error("AI Error:", err)
            setError("AI mentor is currently unavailable. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <Zap className="h-5 w-5" />
                        AI Financial Mentor
                    </CardTitle>
                    <CardDescription>
                        Personalized financial insights based on your profile & goals.
                    </CardDescription>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading || !userId}
                    className="gap-2"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    {loading ? 'Analyzing...' : 'Refresh Advice'}
                </Button>
            </CardHeader>
            <CardContent>
                {error ? (
                    <div className="text-center py-8 text-red-500">
                        {error}
                        <Button variant="link" onClick={() => setError(null)}>Dismiss</Button>
                    </div>
                ) : (
                    <div className="h-[300px] w-full rounded-md border p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                        {loading && !advice ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                <p>Analyzing your finances...</p>
                            </div>
                        ) : advice ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{advice}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <p>No advice generated yet.</p>
                                <Button variant="link" onClick={handleRefresh}>Generate First Report</Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
