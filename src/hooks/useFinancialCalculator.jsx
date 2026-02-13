import { useState, useEffect, useContext, createContext } from 'react'

const FinancialCalculatorContext = createContext({})

export const FinancialCalculatorProvider = ({ children }) => {
    const [financialPlan, setFinancialPlan] = useState({
        emergencyFund: 0,
        monthlyInvestmentRequired: 0,
        recommendedSavings: 0,
        budgetNeeds: 0,
        budgetWants: 0,
        budgetSavings: 0,
        savingsRatio: 0,
        updatedAt: null
    })

    // Load initial plan
    useEffect(() => {
        const storedPlan = localStorage.getItem('financialPlan')
        if (storedPlan) {
            setFinancialPlan(JSON.parse(storedPlan))
        } else {
            // Calculate on first load
            generateFinancialPlan()
        }
    }, [])

    const generateFinancialPlan = () => {
        console.log('🧮 Generating Financial Plan...')

        // Fetch user data
        const profile = JSON.parse(localStorage.getItem('financialProfile') || '{}')
        const goals = JSON.parse(localStorage.getItem('financialGoals') || '[]')

        // If no profile, return defaults
        if (!profile.income) {
            console.log('No financial profile found, using defaults')
            return
        }

        const income = Number(profile.income) || 0
        const expenses = Number(profile.expenses) || 0
        const savings = Number(profile.savings) || 0

        // 1️⃣ Emergency Fund Calculation
        const emergencyFund = expenses * 6

        // 2️⃣ Budget Allocation (50/30/20 Rule)
        const budgetNeeds = income * 0.50
        const budgetWants = income * 0.20
        const budgetSavings = income * 0.30

        // 3️⃣ Monthly Investment Required (Per Goal)
        let monthlyInvestmentRequired = 0

        if (goals.length > 0) {
            const today = new Date()

            goals.forEach(goal => {
                const targetDate = new Date(goal.target_date)
                const monthsRemaining = Math.max(
                    (targetDate.getFullYear() - today.getFullYear()) * 12 +
                    (targetDate.getMonth() - today.getMonth()),
                    1 // Minimum 1 month to avoid division by zero
                )

                const remaining = goal.target_amount - goal.current_amount
                const monthlyRequired = remaining / monthsRemaining

                monthlyInvestmentRequired += monthlyRequired
            })
        }

        // 4️⃣ Savings Ratio
        const savingsRatio = income > 0 ? Math.min(savings / income, 1) : 0

        // 5️⃣ Recommended Savings
        const recommendedSavings = budgetSavings

        const newPlan = {
            emergencyFund: Math.round(emergencyFund),
            monthlyInvestmentRequired: Math.round(monthlyInvestmentRequired),
            recommendedSavings: Math.round(recommendedSavings),
            budgetNeeds: Math.round(budgetNeeds),
            budgetWants: Math.round(budgetWants),
            budgetSavings: Math.round(budgetSavings),
            savingsRatio: parseFloat(savingsRatio.toFixed(2)),
            updatedAt: new Date().toISOString()
        }

        console.log('📊 Financial Plan Generated:', newPlan)

        setFinancialPlan(newPlan)
        localStorage.setItem('financialPlan', JSON.stringify(newPlan))

        return newPlan
    }

    return (
        <FinancialCalculatorContext.Provider value={{
            financialPlan,
            generateFinancialPlan
        }}>
            {children}
        </FinancialCalculatorContext.Provider>
    )
}

export const useFinancialCalculator = () => useContext(FinancialCalculatorContext)
