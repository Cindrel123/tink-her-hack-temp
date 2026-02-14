import { supabase } from '@/lib/supabase'

export const mockLessons = [
    {
        id: '1',
        title: 'Budgeting 101',
        description: 'Master the 50/30/20 rule and take control.',
        content: `## Why Budget?
Budgeting isn't about restriction; it's about permission. It tells your money where to go instead of wondering where it went.

### The 50/30/20 Rule
- **50% Needs**: Essential costs like rent, groceries, and utilities.
- **30% Wants**: Dining out, entertainment, hobbies.
- **20% Savings**: Emergency fund, investments, debt repayment.`,
        level_required: 1,
        xp_reward: 150,
        locked: false
    },
    {
        id: '2',
        title: 'Emergency Funds',
        description: 'Why you need a financial safety net.',
        content: `## Expect the Unexpected
An emergency fund is money set aside for unforeseen expenses like car repairs or medical bills.

### How much do you need?
Aim for **3 to 6 months** of living expenses.`,
        level_required: 2,
        xp_reward: 200,
        locked: false
    },
    {
        id: '3',
        title: 'Compound Interest',
        description: 'The magic of making money work for you.',
        content: `## The Eighth Wonder of the World
Compound interest is interest calculated on the initial principal, which also includes all of the accumulated interest.

### Example
If you invest **$100** at **10%** interest:
- Year 1: $110
- Year 2: $121
- Year 3: $133.10`,
        level_required: 3,
        xp_reward: 300,
        locked: true
    },
    {
        id: '4',
        title: 'Investing Basics',
        description: 'Stocks, Bonds, and ETFs explained.',
        content: `## Putting Money to Work
Investing is how you build wealth.

- **Stocks**: Ownership in a company.
- **Bonds**: Loans to a company or government.
- **ETFs**: A basket of stocks/bonds.`,
        level_required: 5,
        xp_reward: 500,
        locked: true
    }
]

export const mockQuizzes = {
    '1': [
        {
            id: 'q1',
            question: 'What percentage of income goes to "Needs" in the 50/30/20 rule?',
            options: ['20%', '30%', '50%', '10%'],
            correct_answer: '50%'
        },
        {
            id: 'q2',
            question: 'Which of these is a "Want"?',
            options: ['Rent', 'Groceries', 'Netflix Subscription', 'Electricity'],
            correct_answer: 'Netflix Subscription'
        },
        {
            id: 'q3',
            question: 'What is the "20%" in the 50/30/20 rule usually allocated to?',
            options: ['Wants', 'Dining out', 'Savings & Investments', 'Luxury Travel'],
            correct_answer: 'Savings & Investments'
        }
    ],
    '2': [
        {
            id: 'q4',
            question: 'What is the recommended size of an emergency fund?',
            options: ['1 week', '3-6 months', '1 year', '$100'],
            correct_answer: '3-6 months'
        }
    ],
    '3': [
        {
            id: 'q5',
            question: 'What is Compound Interest?',
            options: [
                'Interest only on the principal',
                'Interest on principal plus accumulated interest',
                'A flat fee paid annually',
                'Interest that decreases over time'
            ],
            correct_answer: 'Interest on principal plus accumulated interest'
        },
        {
            id: 'q6',
            question: 'Who famously called compound interest the "Eighth Wonder of the World"?',
            options: ['Warren Buffett', 'Elon Musk', 'Albert Einstein', 'Adam Smith'],
            correct_answer: 'Albert Einstein'
        },
        {
            id: 'q7',
            question: 'If you invest $100 at 10% interest, how much will you have after 2 years with annual compounding?',
            options: ['$110', '$121', '$120', '$200'],
            correct_answer: '$121'
        }
    ],
    '4': [
        {
            id: 'q8',
            question: 'What represents fractional ownership in a company?',
            options: ['Bonds', 'Stocks', 'ETFs', 'Mutual Funds'],
            correct_answer: 'Stocks'
        },
        {
            id: 'q9',
            question: 'What is a "basket" of stocks or bonds that can be traded on an exchange?',
            options: ['A Savings Account', 'An ETF', 'A Fixed Deposit', 'A Cryptocurrency'],
            correct_answer: 'An ETF'
        },
        {
            id: 'q10',
            question: 'Which of these is generally considered a fixed-income investment lower in risk than stocks?',
            options: ['Venture Capital', 'Bonds', 'Day Trading', 'Hedge Funds'],
            correct_answer: 'Bonds'
        }
    ]
}

export const educationService = {
    async getLessons() {
        try {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .order('level_required', { ascending: true })

            if (error || !data || data.length === 0) {
                console.warn('Using mock lessons data due to Supabase error or empty table:', error)
                return mockLessons
            }
            return data
        } catch (e) {
            console.error(e)
            return mockLessons
        }
    },

    async getQuizForLesson(lessonId) {
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .eq('lesson_id', lessonId)

            if (error || !data || data.length === 0) {
                // Return mock quiz if available
                return mockQuizzes[lessonId] || []
            }
            return data
        } catch (e) {
            return mockQuizzes[lessonId] || []
        }
    },

    async getUserProgress(userId) {
        if (!userId) return []
        try {
            // Check local storage first for immediate persistence during demo/testing
            const localProgress = localStorage.getItem(`lesson_progress_${userId}`)
            if (localProgress) {
                return JSON.parse(localProgress)
            }

            const { data, error } = await supabase
                .from('lesson_progress')
                .select('*')
                .eq('user_id', userId)

            if (error) throw error

            if (data && data.length > 0) {
                localStorage.setItem(`lesson_progress_${userId}`, JSON.stringify(data))
                return data
            }
            return []
        } catch (e) {
            console.error(e)
            // Final fallback to localStorage in case of network error
            const localProgress = localStorage.getItem(`lesson_progress_${userId}`)
            return localProgress ? JSON.parse(localProgress) : []
        }
    },

    async completeLesson(userId, lessonId, score) {
        if (!userId) return null
        try {
            // Update local storage first for persistence
            const localProgress = JSON.parse(localStorage.getItem(`lesson_progress_${userId}`) || '[]')
            const existingIndex = localProgress.findIndex(p => p.lesson_id === lessonId)

            const newProgress = {
                user_id: userId,
                lesson_id: lessonId,
                completed: true,
                score: score,
                completed_at: new Date().toISOString()
            }

            if (existingIndex > -1) {
                localProgress[existingIndex] = newProgress
            } else {
                localProgress.push(newProgress)
            }
            localStorage.setItem(`lesson_progress_${userId}`, JSON.stringify(localProgress))

            const { data, error } = await supabase
                .from('lesson_progress')
                .upsert({
                    user_id: userId,
                    lesson_id: lessonId,
                    completed: true,
                    score: score,
                    completed_at: new Date()
                })
                .select()

            if (error) throw error
            return data
        } catch (e) {
            console.error("Error completing lesson:", e)
            // We still return true-ish because we saved to localStorage
            return [{ lesson_id: lessonId, completed: true, score }]
        }
    }
}
