import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage in Vite
})

export async function generateFinancialAdvice(userId, userData = {}) {
    if (!userId) {
        throw new Error("User ID is required to generate advice.")
    }

    try {
        console.log("🤖 Generating AI Financial Advice for:", userId)

        // Destructure provided data or strictly fetch if not provided (fallback logic)
        // For this hybrid app, we prefer passed data (from localStorage) over DB for inputs
        // to ensure immediate responsiveness to user changes.
        const {
            profile = {},
            goals = [],
            gamification = {},
            plan = {}
        } = userData;

        // If data is absolutely missing, we could try fetching from Supabase as a fallback, 
        // but passing it from the component is more reliable for the current architecture.

        // 2. Structure Prompt
        // Handle missing data gracefully by providing defaults
        const userDetails = `
        Age: ${profile?.age || '25 (Default)'}
        Income: ${profile?.income || '0'}
        Expenses: ${profile?.expenses || '0'}
        Savings: ${profile?.savings || '0'}
        Debt: ${profile?.debt || '0'}
        `

        const userGoals = goals && goals.length > 0
            ? goals.map(g => `- ${g.goal_name}: Target ${g.target_amount}, by ${g.target_date}, Current: ${g.current_amount}`).join('\n')
            : "No specific goals set."

        const userRisk = `Risk Level: ${gamification?.level || 'Beginner'}`
        const userScore = `Financial Score: ${gamification?.financial_score || 'N/A'}`

        const userPlan = `
        Emergency Fund: ${plan?.emergency_fund || '0'}
        Monthly Investment Required: ${plan?.monthly_investment_required || '0'}
        Budget Needs: ${plan?.budget_needs || '0'}
        Budget Wants: ${plan?.budget_wants || '0'}
        Budget Savings: ${plan?.budget_savings || '0'}
        `

        const prompt = `
        You are a professional financial advisor acting as a "Lifestyle Finance Mentor".

        User details:
        ${userDetails}

        Goals:
        ${userGoals}

        ${userRisk}
        ${userScore}

        Financial Plan Data:
        ${userPlan}

        Provide personalized advice in the following strictly structured format:
        1. **Budget Improvement**: Specific suggestions based on income/expenses.
        2. **Savings Optimization**: Advice on savings ratio and emergency fund.
        3. **Investment Recommendations**: General strategy based on risk/age (no specific stocks).
        4. **Goal Achievement Strategy**: How to reach the listed goals.
        5. **Motivation**: One short, punchy motivational statement.

        Keep tone friendly, encouraging, and clear for young adults. Use emojis where appropriate.
        `

        console.log("📝 Sending Prompt to OpenAI...")

        // 3. Call OpenAI API
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo", // Cost-effective model
        })

        const adviceText = completion.choices[0].message.content

        // 4. Store Advice in Supabase
        // Upsert is not ideal if we want history, but for now we insert new rows (userId + timestamp)
        // If we want to replace the latest, logic might differ, but 'history' is usually good
        const { error: insertError } = await supabase.from('ai_advice').insert({
            user_id: userId,
            advice_text: adviceText
        })

        if (insertError) {
            console.error("Error storing advice:", insertError)
            // We still return the advice even if storage fails
        }

        return adviceText

    } catch (error) {
        console.error("❌ Error generating financial advice:", error)
        throw error
    }
}

export async function getLatestAdvice(userId) {
    const { data, error } = await supabase
        .from('ai_advice')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) throw error
    return data
}
