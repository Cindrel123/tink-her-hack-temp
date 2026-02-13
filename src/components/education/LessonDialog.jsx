import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Trophy, ArrowRight, ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import confetti from 'canvas-confetti'

export default function LessonDialog({ open, onOpenChange, lesson, quizzes = [], onComplete, isCompleted }) {
    const [step, setStep] = useState('content') // 'content' | 'quiz' | 'result'
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [score, setScore] = useState(0)
    const [passed, setPassed] = useState(false)

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setStep('content')
                setCurrentQuestion(0)
                setAnswers({})
                setScore(0)
                setPassed(false)
            }, 300)
        }
    }, [open])

    const handleStartQuiz = () => {
        setStep('quiz')
    }

    const handleAnswer = (value) => {
        setAnswers({ ...answers, [currentQuestion]: value })
    }

    const handleNextQuestion = () => {
        if (currentQuestion < quizzes.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            calculateResult()
        }
    }

    const calculateResult = () => {
        let correctCount = 0
        quizzes.forEach((q, index) => {
            if (answers[index] === q.correct_answer) {
                correctCount++
            }
        })

        const finalScore = Math.round((correctCount / quizzes.length) * 100)
        setScore(finalScore)
        setPassed(finalScore >= 70)
        setStep('result')

        if (finalScore >= 70) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
            if (!isCompleted) {
                onComplete(lesson.id, finalScore)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                {step === 'content' && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <span className="bg-malachite-100 text-malachite-700 p-2 rounded-lg">
                                    <Trophy className="h-5 w-5" />
                                </span>
                                {lesson?.title}
                            </DialogTitle>
                            <DialogDescription>
                                Level {lesson?.level_required} • {lesson?.xp_reward} XP Reward
                            </DialogDescription>
                        </DialogHeader>

                        <div className="prose prose-neutral max-w-none py-4">
                            <ReactMarkdown>{lesson?.content}</ReactMarkdown>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleStartQuiz} className="w-full sm:w-auto bg-malachite-600 hover:bg-malachite-700 text-white">
                                {isCompleted ? "Retake Quiz" : "Start Quiz"} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === 'quiz' && quizzes.length > 0 && (
                    <>
                        <DialogHeader>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-neutral-500">
                                    Question {currentQuestion + 1} of {quizzes.length}
                                </span>
                                <span className="text-sm font-medium text-malachite-600">
                                    {Math.round(((currentQuestion + 1) / quizzes.length) * 100)}%
                                </span>
                            </div>
                            <Progress value={((currentQuestion + 1) / quizzes.length) * 100} className="h-2" />
                            <DialogTitle className="mt-4 text-xl">
                                {quizzes[currentQuestion].question}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="py-6 space-y-4">
                            <RadioGroup
                                value={answers[currentQuestion]}
                                onValueChange={handleAnswer}
                                className="space-y-3"
                            >
                                {quizzes[currentQuestion].options.map((option, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors has-[:checked]:bg-malachite-50 has-[:checked]:border-malachite-200">
                                        <RadioGroupItem value={option} id={`option-${idx}`} />
                                        <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer font-medium">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <DialogFooter className="flex justify-between sm:justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                            <Button
                                onClick={handleNextQuestion}
                                disabled={!answers[currentQuestion]}
                                className="bg-malachite-600 hover:bg-malachite-700 text-white"
                            >
                                {currentQuestion === quizzes.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === 'result' && (
                    <div className="text-center py-8 space-y-6">
                        <div className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center ${passed ? 'bg-malachite-100 text-malachite-600' : 'bg-red-100 text-red-600'}`}>
                            {passed ? <Trophy className="h-12 w-12" /> : <CheckCircle2 className="h-12 w-12" />}
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-neutral-900">
                                {passed ? "Quiz Completed!" : "Keep Trying!"}
                            </h2>
                            <p className="text-neutral-500">
                                You scored <span className="font-bold text-neutral-900">{score}%</span>
                            </p>
                        </div>

                        {passed ? (
                            <div className="bg-malachite-50 p-6 rounded-xl border border-malachite-100 max-w-sm mx-auto">
                                <p className="text-malachite-800 font-medium mb-1">Rewards Earned</p>
                                <div className="text-3xl font-bold text-malachite-600">+{lesson.xp_reward} XP</div>
                            </div>
                        ) : (
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 max-w-sm mx-auto text-sm text-red-600">
                                You need 70% to pass. Review the material and try again!
                            </div>
                        )}

                        <DialogFooter className="justify-center sm:justify-center gap-4">
                            {!passed && (
                                <Button variant="outline" onClick={() => setStep('content')}>
                                    Review Content
                                </Button>
                            )}
                            <Button onClick={() => onOpenChange(false)} className="bg-neutral-900 hover:bg-neutral-800 text-white min-w-[200px]">
                                {passed ? "Collect Rewards & Close" : "Close"}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
