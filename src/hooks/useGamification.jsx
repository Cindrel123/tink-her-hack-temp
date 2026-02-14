import { useState, useEffect, useContext, createContext } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { challengesService } from '@/services/challengesService'

const GamificationContext = createContext({})

// LEVEL THRESHOLDS
const LEVELS = [0, 100, 300, 700, 1500, 3000, 5000, 8000, 12000, 20000]

export const GamificationProvider = ({ children }) => {
    const { user } = useAuth()

    // Current Gamification State
    const [xp, setXP] = useState(0)
    const [level, setLevel] = useState(1)
    const [score, setScore] = useState(0)
    const [badges, setBadges] = useState([])
    const [streak, setStreak] = useState(0)

    // UI Triggers
    const [showReward, setShowReward] = useState(false)
    const [rewardMessage, setRewardMessage] = useState('')

    // Load Initial State & Check Streak
    useEffect(() => {
        const loadGamificationData = async () => {
            // 1. Try Local Storage first for instant UI
            const stored = localStorage.getItem('gamification')
            if (stored) {
                const data = JSON.parse(stored)
                setXP(data.xp || 0)
                setLevel(data.level || 1)
                setScore(data.score || 0)
                setBadges(data.badges || [])
                setStreak(data.streak || 0)
            }

            // 2. If User is logged in, Sync with Supabase & Check Daily Streak
            if (user) {
                try {
                    // Check Streak using Service Logic
                    const { streak: newStreak, new: isNewDay, bonusXP } = await challengesService.checkDailyStreak(user.id)

                    if (isNewDay) {
                        setStreak(newStreak)
                        if (bonusXP > 0) {
                            addXP(bonusXP) // This handles local state & notification
                            setRewardMessage(`Daily Streak Bonus: +${bonusXP} XP!`)
                            setShowReward(true)
                        }
                    } else {
                        // Just sync if not new day (or if streak was 0)
                        setStreak(newStreak)
                    }

                    // Fetch full profile to verify transparency
                    let { data: profile } = await supabase
                        .from('gamification')
                        .select('*')
                        .eq('user_id', user.id)
                        .single()

                    if (profile) {
                        setXP(profile.xp)
                        setLevel(profile.level)
                        // If service updated streak, profile.streak_days should match
                        if (!isNewDay) setStreak(profile.streak_days)

                        saveState({ xp: profile.xp, level: profile.level, score: profile.score, badges: [], streak: profile.streak_days })
                    }
                } catch (err) {
                    console.warn("Failed to sync gamification with Supabase:", err)
                }
            }
        }

        loadGamificationData()
        calculateScore()
    }, [user])

    const saveState = (newState) => {
        localStorage.setItem('gamification', JSON.stringify(newState))
        // Ideally sync to Supabase here too
        if (user) {
            supabase.from('gamification').upsert({
                user_id: user.id,
                xp: newState.xp,
                level: newState.level,
                score: newState.score,
                streak_days: newState.streak,
                updated_at: new Date().toISOString()
            }).then(({ error }) => {
                if (error) console.error("Failed to save gamification to DB", error)
            })
        }
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

            // Check Level Badge (Example: Unlock at Level 3)
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
