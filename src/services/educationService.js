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
        }
    ],
    '2': [
        {
            id: 'q3',
            question: 'What is the recommended size of an emergency fund?',
            options: ['1 week', '3-6 months', '1 year', '$100'],
            correct_answer: '3-6 months'
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
            const { data, error } = await supabase
                .from('lesson_progress')
                .select('*')
                .eq('user_id', userId)

            if (error) throw error
            return data || []
        } catch (e) {
            console.error(e)
            return []
        }
    },

    async completeLesson(userId, lessonId, score) {
        if (!userId) return null
        try {
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
            return null
        }
    }
}
