
import { supabase } from '@/lib/supabase'

export const challengesService = {
    // --- Streak Logic ---
    async checkDailyStreak(userId) {
        if (!userId) return { streak: 0, new: false }

        try {
            // Get current gamification state
            const { data, error } = await supabase
                .from('gamification')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error && error.code !== 'PGRST116') throw error // Ignore 'not found'

            const today = new Date().toISOString().split('T')[0]
            let streak = data?.streak_days || 0
            let lastLoginDate = data?.last_login_date ? new Date(data.last_login_date).toISOString().split('T')[0] : null
            let xp = data?.xp || 0
            let message = ''

            // If already logged in today, do nothing
            if (lastLoginDate === today) {
                return { streak, new: false, xp }
            }

            // Check if logged in yesterday
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split('T')[0]

            if (lastLoginDate === yesterdayStr) {
                streak += 1
                message = `Daily Streak: ${streak} days!`
            } else {
                streak = 1 // Reset or Start new
                message = 'Daily Streak started!'
            }

            // Check Streak Milestones & Award XP
            let bonusXP = 0
            if (streak === 3) bonusXP = 20
            if (streak === 7) bonusXP = 50
            if (streak === 30) bonusXP = 100 // Unlocks badge logic handled in hook

            if (bonusXP > 0) {
                xp += bonusXP
                message += ` (+${bonusXP} XP Bonus)`
            }

            // Update Database
            const updates = {
                user_id: userId,
                streak_days: streak,
                last_login_date: new Date().toISOString(),
                xp: xp,
                updated_at: new Date().toISOString()
            }

            if (data) {
                await supabase.from('gamification').update(updates).eq('user_id', userId)
            } else {
                await supabase.from('gamification').insert([updates])
            }

            return { streak, new: true, message, bonusXP }

        } catch (err) {
            console.error('Error checking streak:', err)
            return { streak: 0, new: false }
        }
    },

    // --- Challenges Logic ---
    async getChallenges(userId, type = 'daily') {
        if (!userId) return []

        try {
            // 1. Get all challenges of type
            const { data: allChallenges, error: cError } = await supabase
                .from('challenges')
                .select('*')
                .eq('type', type)

            if (cError) throw cError

            // 2. Get user progress
            const { data: userProgress, error: pError } = await supabase
                .from('user_challenges')
                .select('*')
                .eq('user_id', userId)

            if (pError) throw pError

            // 3. Merge
            return allChallenges.map(challenge => {
                const progress = userProgress.find(p => p.challenge_id === challenge.id)
                return {
                    ...challenge,
                    progress: progress ? progress.progress : 0,
                    completed: progress ? progress.completed : false
                }
            })

        } catch (err) {
            console.error('Error fetching challenges:', err)
            return [] // Return empty or mock fallback
        }
    },

    async updateProgress(userId, challengeId, progressAmount, requirementValue) {
        if (!userId) return null

        try {
            // Check existing progress
            const { data: existing, error: eError } = await supabase
                .from('user_challenges')
                .select('*')
                .eq('user_id', userId)
                .eq('challenge_id', challengeId)
                .single()

            let currentProgress = existing ? existing.progress : 0
            let isCompleted = existing ? existing.completed : false

            if (isCompleted) return null // Already done

            const newProgress = Math.min(currentProgress + progressAmount, requirementValue)
            const nowCompleted = newProgress >= requirementValue

            const upsertData = {
                user_id: userId,
                challenge_id: challengeId,
                progress: newProgress,
                completed: nowCompleted,
                completed_at: nowCompleted ? new Date().toISOString() : null,
                last_updated: new Date().toISOString()
            }

            // Upsert: Need to handle ID if inserting new
            if (existing) {
                await supabase.from('user_challenges').update(upsertData).eq('id', existing.id)
            } else {
                // Need challenge_id in insert
                await supabase.from('user_challenges').insert([{ ...upsertData }])
            }

            return { completed: nowCompleted, progress: newProgress }

        } catch (err) {
            console.error('Error updating challenge progress:', err)
            return null
        }
    }
}
