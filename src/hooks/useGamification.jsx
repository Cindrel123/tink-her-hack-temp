import { useState, useEffect, useContext, createContext } from 'react'

const GamificationContext = createContext({})

// LEVEL THRESHOLDS
const LEVELS = [0, 100, 300, 700, 1500, 3000, 5000, 8000, 12000, 20000]

export const GamificationProvider = ({ children }) => {
    // Current Gamification State
    const [xp, setXP] = useState(0)
    const [level, setLevel] = useState(1)
    const [score, setScore] = useState(0)
    const [badges, setBadges] = useState([])
    const [streak, setStreak] = useState(0)

    // UI Triggers
    const [showReward, setShowReward] = useState(false)
    const [rewardMessage, setRewardMessage] = useState('')

    // Load Initial State
    useEffect(() => {
        const storedGamification = localStorage.getItem('gamification')
        if (storedGamification) {
            const data = JSON.parse(storedGamification)
            setXP(data.xp || 0)
            setLevel(data.level || 1)
            setScore(data.score || 0)
            setBadges(data.badges || [])
            setStreak(data.streak || 0)
        } else {
            // New User Setup
            setXP(0)
            setLevel(1)
            setScore(0)
            setBadges([])
            setStreak(1) // Start with 1 day streak
            saveState({ xp: 0, level: 1, score: 0, badges: [], streak: 1 })
        }

        // Calculate Score on load
        calculateScore()
    }, [])

    const saveState = (newState) => {
        localStorage.setItem('gamification', JSON.stringify(newState))
    }

    const calculateScore = () => {
        // Read financial data
        const financialProfile = JSON.parse(localStorage.getItem('financialProfile') || '{}')
        const goals = JSON.parse(localStorage.getItem('financialGoals') || '[]')

        let savingsRatio = 0
        if (financialProfile.income && financialProfile.income > 0) {
            savingsRatio = (financialProfile.savings / financialProfile.income) * 100
        }

        let goalProgress = 0
        if (goals.length > 0) {
            const totalProgress = goals.reduce((acc, g) => acc + (g.current_amount / g.target_amount), 0)
            goalProgress = (totalProgress / goals.length) * 100
        }

        // Formula: (Savings Ratio * 0.4) + (Goal Progress * 0.4) + (Streak * 2) 
        // Capped at 100
        let newScore = Math.round((savingsRatio * 0.4) + (goalProgress * 0.4) + (streak * 2))
        newScore = Math.min(newScore, 100)

        setScore(newScore)
        // Update local storage inside saveState would be cleaner, but simple state update is fine here
        // as we re-calc on load.
    }

    const addXP = (amount) => {
        const newXP = xp + amount
        setXP(newXP)

        // Check Level Up
        let newLevel = level
        // Find highest level threshold we've passed
        for (let i = 0; i < LEVELS.length; i++) {
            if (newXP >= LEVELS[i]) {
                newLevel = i + 1
            }
        }

        if (newLevel > level) {
            setLevel(newLevel)
            setShowReward(true)
            setRewardMessage(`You've reached Level ${newLevel}!`)

            // Check Level Badge
            if (newLevel === 3) {
                unlockBadge("Wealth Explorer", "Reach Level 3")
            }
        }

        saveState({ xp: newXP, level: newLevel, score, badges, streak })
    }

    const unlockBadge = (badgeName, description) => {
        if (!badges.find(b => b.name === badgeName)) {
            const newBadge = {
                id: crypto?.randomUUID ? crypto.randomUUID() : `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: badgeName,
                description,
                earnedAt: new Date().toISOString()
            }
            const updatedBadges = [...badges, newBadge]
            setBadges(updatedBadges)
            saveState({ xp, level, score, badges: updatedBadges, streak })

            // Could show a notification here too
            console.log(`Badge Unlocked: ${badgeName}`)
        }
    }

    return (
        <GamificationContext.Provider value={{
            xp, level, score, badges, streak,
            addXP, unlockBadge,
            showReward, setShowReward, rewardMessage,
            calculateScore // Expose to re-calc when financials change
        }}>
            {children}
        </GamificationContext.Provider>
    )
}

export const useGamification = () => useContext(GamificationContext)
