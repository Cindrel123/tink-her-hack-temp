import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, CheckCircle2, Trophy, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LessonCard({ lesson, userLevel, isCompleted, onStart }) {
    const isLocked = lesson.level_required > userLevel

    return (
        <Card className={cn(
            "card-nova overflow-hidden transition-all duration-300 relative group border-none shadow-sm hover:shadow-md",
            isLocked ? "bg-malachite-50/50 opacity-80" : "bg-white",
            isCompleted && "border-l-4 border-l-malachite-500"
        )}>
            {/* Background Icon (Decorator) */}
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="h-24 w-24 text-malachite-600" />
            </div>

            <CardHeader className="space-y-1">
                <div className="flex justify-between items-start">
                    <Badge variant={isCompleted ? "success" : isLocked ? "outline" : "secondary"} className="mb-2">
                        {isCompleted ? "Completed" : `Level ${lesson.level_required}`}
                    </Badge>
                    {isCompleted && <CheckCircle2 className="h-5 w-5 text-malachite-600" />}
                    {isLocked && <Lock className="h-5 w-5 text-neutral-400" />}
                </div>
                <CardTitle className="text-xl font-bold text-malachite-950 group-hover:text-malachite-600 transition-colors">
                    {lesson.title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-malachite-500 line-clamp-2 min-h-[40px]">
                    {lesson.description}
                </p>

                <div className="flex items-center gap-4 mt-6 text-xs font-medium text-malachite-600">
                    <div className="flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                        <span>{lesson.xp_reward} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-malachite-500" />
                        <span>5 min</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    variant={isLocked ? "ghost" : isCompleted ? "outline" : "default"}
                    className={cn(
                        "w-full",
                        !isLocked && !isCompleted && "bg-malachite-600 hover:bg-malachite-700 text-white shadow-md shadow-malachite-200"
                    )}
                    disabled={isLocked}
                    onClick={() => onStart(lesson)}
                >
                    {isLocked ? (
                        <span className="flex items-center gap-2">
                            <Lock className="h-4 w-4" /> Locked (Lvl {lesson.level_required})
                        </span>
                    ) : isCompleted ? (
                        "Review Lesson"
                    ) : (
                        "Start Learning"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
