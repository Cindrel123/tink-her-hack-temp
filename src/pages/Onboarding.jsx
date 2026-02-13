import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useGamification } from '@/hooks/useGamification'
import { useFinancialCalculator } from '@/hooks/useFinancialCalculator'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Onboarding() {
    const { user } = useAuth()
    const { addXP, calculateScore } = useGamification()
    const { generateFinancialPlan } = useFinancialCalculator()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1) // 1: Personal, 2: Financial
    const [formData, setFormData] = useState({
        age: '',
        income: '',
        expenses: '',
        savings: '',
        debt: '0'
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const validateStep1 = () => {
        if (!formData.age || Number(formData.age) <= 0) {
            setError("Please enter a valid age")
            return false
        }
        return true
    }

    const validateStep2 = () => {
        if (!formData.income || Number(formData.income) <= 0) {
            setError("Monthly income must be greater than 0")
            return false
        }
        if (!formData.expenses || Number(formData.expenses) < 0) {
            setError("Monthly expenses cannot be negative")
            return false
        }
        if (!formData.savings || Number(formData.savings) < 0) {
            setError("Current savings cannot be negative")
            return false
        }
        return true
    }

    const handleNext = () => {
        setError('')
        if (step === 1 && validateStep1()) {
            setStep(2)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateStep2()) return

        setLoading(true)

        try {
            // Prepare data for Supabase
            const profileData = {
                user_id: user?.id || 'mock-id-123',
                age: Number(formData.age),
                income: Number(formData.income),
                expenses: Number(formData.expenses),
                savings: Number(formData.savings),
                debt: Number(formData.debt || 0)
            }

            // Try Insert to real Supabase
            const { error: dbError } = await supabase
                .from('financial_profile')
                .insert([profileData])

            if (dbError) {
                console.warn("Supabase insert failed (expected in mock mode):", dbError.message)
                // Fallback or ignore in mock mode
            }

            // Mock Persistence
            localStorage.setItem('financialProfile', JSON.stringify(profileData))

            // Award XP for completing profile
            addXP(50)
            calculateScore() // Recalculate financial score with new data
            generateFinancialPlan() // Generate personalized financial plan

            // Redirect
            navigate('/goals')

        } catch (err) {
            console.error("Onboarding Error:", err)
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const progress = step === 1 ? 50 : 100

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-slate-500">Step {step} of 2</span>
                        <span className="text-sm font-medium text-slate-500">{progress}% Completed</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <CardTitle className="mt-6 text-2xl text-center">
                        {step === 1 ? "Tell us about yourself" : "Your Financial Snapshot"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        We use this data to calculate your financial health score.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="onboarding-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm flex items-center gap-2 mb-4">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="e.g. 25"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="120"
                                    />
                                    <p className="text-xs text-slate-500">We verify age for retirement planning suggestions.</p>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="income">Monthly Income ($)</Label>
                                        <Input
                                            id="income"
                                            type="number"
                                            placeholder="5000"
                                            value={formData.income}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="expenses">Monthly Expenses ($)</Label>
                                        <Input
                                            id="expenses"
                                            type="number"
                                            placeholder="3000"
                                            value={formData.expenses}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="savings">Current Savings ($)</Label>
                                    <Input
                                        id="savings"
                                        type="number"
                                        placeholder="10000"
                                        value={formData.savings}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="debt">Total Debt (Optional) ($)</Label>
                                    <Input
                                        id="debt"
                                        type="number"
                                        placeholder="0"
                                        value={formData.debt}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step === 2 ? (
                        <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>
                            Back
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step === 1 ? (
                        <Button onClick={handleNext}>Next Step</Button>
                    ) : (
                        <Button type="submit" form="onboarding-form" disabled={loading}>
                            {loading ? (
                                <>Saving Profile...</>
                            ) : (
                                <>Save & Continue <CheckCircle2 className="ml-2 h-4 w-4" /></>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
