import { useState, useEffect } from 'react'
import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { GraduationCap, BookOpen, Star, Trophy, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useGamification } from '@/hooks/useGamification'
import { educationService, mockLessons, mockQuizzes } from '@/services/educationService'
import LessonCard from '@/components/education/LessonCard'
import LessonDialog from '@/components/education/LessonDialog'
import { toast } from 'sonner' // Assuming sonner is installed, if not will fallback to alert or simple logic

export default function Education() {
    const { user } = useAuth()
    const { level, addXP } = useGamification()
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState([])
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [userAnswers, setUserAnswers] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch lessons
                const lessonsData = await educationService.getLessons()
                setLessons(lessonsData)

                // Fetch user progress
                if (user) {
                    const progressData = await educationService.getUserProgress(user.id)
                    setProgress(progressData)
                }
            } catch (error) {
                console.error("Failed to load education data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user])

    const handleStartLesson = (lesson) => {
        setSelectedLesson(lesson)
        setIsDialogOpen(true)
    }

    const handleLessonComplete = async (lessonId, score) => {
        if (!user) return

        // Check if already completed
        const alreadyCompleted = progress.some(p => p.lesson_id === lessonId && p.completed)
        if (alreadyCompleted) {
            return
        }

        try {
            // Find lesson for XP reward
            const lesson = lessons.find(l => l.id === lessonId)
            if (lesson) {
                // Award XP
                await addXP(lesson.xp_reward)

                // Update local progress state immediately for UI 
                setProgress(prev => [
                    ...prev,
                    { lesson_id: lessonId, completed: true, score, user_id: user.id }
                ])

                // Persist to DB
                await educationService.completeLesson(user.id, lessonId, score)

                toast.success(`Lesson Completed! +${lesson.xp_reward} XP`)
            }
        } catch (error) {
            console.error("Error completing lesson", error)
            toast.error("Failed to save progress")
        }
    }

    // Calculate overall statistics
    const completedCount = progress.filter(p => p.completed).length
    const totalLessons = lessons.length
    const completionPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0
    const totalXPEarned = progress.reduce((sum, p) => {
        const lesson = lessons.find(l => l.id === p.lesson_id)
        return sum + (lesson ? lesson.xp_reward : 0)
    }, 0)

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Header Section with Stats */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-malachite-600" />
                            Financial Academy
                        </h1>
                        <p className="text-neutral-500 mt-2 max-w-xl">
                            Master your money with bite-sized lessons. Complete quizzes to earn XP, level up, and unlock advanced topics.
                        </p>
                    </div>
                </div>

                {/* Progress Overview Card */}
                <Card className="bg-neutral-900 text-white border-none bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80')] bg-cover bg-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm"></div>
                    <CardContent className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-2 text-malachite-400 font-medium">
                                <Trophy className="h-5 w-5" />
                                <span>Level {level} Scholar</span>
                            </div>
                            <h2 className="text-3xl font-bold">Your Learning Path</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-300">{completedCount} of {totalLessons} Lessons Completed</span>
                                    <span className="text-white font-bold">{Math.round(completionPercentage)}%</span>
                                </div>
                                <Progress value={completionPercentage} className="h-3 bg-neutral-700" indicatorColor="bg-malachite-500" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 text-center min-w-[100px]">
                                <div className="text-2xl font-bold text-white">{totalXPEarned}</div>
                                <div className="text-xs text-neutral-400 uppercase tracking-wider mt-1">XP Earned</div>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 text-center min-w-[100px]">
                                <div className="text-2xl font-bold text-malachite-400">{completedCount}</div>
                                <div className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Badges</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lessons Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-malachite-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson) => {
                            const isCompleted = progress.some(p => p.lesson_id === lesson.id && p.completed)
                            return (
                                <LessonCard
                                    key={lesson.id}
                                    lesson={lesson}
                                    userLevel={level}
                                    isCompleted={isCompleted}
                                    onStart={handleStartLesson}
                                />
                            )
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && lessons.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                            <BookOpen className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900">No lessons available</h3>
                        <p className="text-neutral-500 mt-2">Check back later for new content!</p>
                    </div>
                )}
            </div>

            {/* Lesson & Quiz Dialog */}
            {selectedLesson && (
                <LessonDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    lesson={selectedLesson}
                    quizzes={mockQuizzes[selectedLesson.id] || []} // In real app, fetch this async or passed in
                    onComplete={handleLessonComplete}
                    isCompleted={progress.some(p => p.lesson_id === selectedLesson.id && p.completed)}
                />
            )}
        </MainLayout>
    )
}
