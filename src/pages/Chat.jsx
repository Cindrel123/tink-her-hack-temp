import { useState, useEffect, useRef } from 'react'
import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ChatWindow from '@/components/chat/ChatWindow'
import ChatInput from '@/components/chat/ChatInput'
import { useAuth } from '@/hooks/useAuth'
import { useGamification } from '@/hooks/useGamification'
import { useFinancialCalculator } from '@/hooks/useFinancialCalculator'
import { sendMessageToGemini } from '@/lib/gemini'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Bot, Sparkles, Trash2 } from 'lucide-react'

export default function Chat() {
    const { user } = useAuth()
    const { xp, level, score } = useGamification()
    const { financialPlan } = useFinancialCalculator()
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (user) {
            fetchChatHistory()
        }
    }, [user])

    const fetchChatHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true })

            if (error) throw error
            setMessages(data || [])
        } catch (error) {
            console.error("Error fetching chat history:", error)
            // If table doesn't exist, we'll just have an empty array
            setMessages([])
        } finally {
            setIsLoading(false)
        }
    }

    const isProcessing = useRef(false)

    const handleSendMessage = async (text) => {
        if (!user || !text.trim() || isProcessing.current) return

        isProcessing.current = true
        setIsTyping(true)

        const userMessage = {
            id: crypto.randomUUID(), // Temp ID for immediate UI
            user_id: user.id,
            role: 'user',
            message: text,
            created_at: new Date().toISOString()
        }

        // 1. Update UI immediately
        setMessages(prev => [...prev, userMessage])

        try {
            // 2. Save user message to Supabase
            const { error: userMsgError } = await supabase
                .from('chat_messages')
                .insert([{
                    user_id: user.id,
                    role: 'user',
                    message: text
                }])

            if (userMsgError) console.error("Error saving user message:", userMsgError)

            // 3. Prepare financial data for context
            const financialProfile = JSON.parse(localStorage.getItem('financialProfile') || '{}')
            const goals = JSON.parse(localStorage.getItem('financialGoals') || '[]')

            const contextData = {
                income: financialProfile.income,
                expenses: financialProfile.expenses,
                savings: financialProfile.savings,
                financialScore: score,
                savingsRatio: Math.round((financialPlan?.savingsRatio || 0) * 100),
                emergencyFundStatus: financialPlan?.emergencyFund > 0 ? `Target: $${financialPlan.emergencyFund}` : 'Not set',
                goals: goals,
                level: level,
                xp: xp
            }

            // 4. Send to Gemini
            const aiResponseText = await sendMessageToGemini(text, contextData)

            const aiMessage = {
                id: crypto.randomUUID(), // Temp ID
                user_id: user.id,
                role: 'assistant',
                message: aiResponseText,
                created_at: new Date().toISOString()
            }

            // 5. Update UI with AI response
            setMessages(prev => [...prev, aiMessage])

            // 6. Save AI message to Supabase
            const { error: aiMsgError } = await supabase
                .from('chat_messages')
                .insert([{
                    user_id: user.id,
                    role: 'assistant',
                    message: aiResponseText
                }])

            if (aiMsgError) console.error("Error saving AI message:", aiMsgError)

        } catch (error) {
            console.error("Chat Error:", error)
            toast.error(error.message || "Something went wrong. Please try again.")
        } finally {
            setIsTyping(false)
            isProcessing.current = false
        }
    }

    const clearChat = async () => {
        if (!confirm("Are you sure you want to clear your chat history?")) return

        try {
            const { error } = await supabase
                .from('chat_messages')
                .delete()
                .eq('user_id', user.id)

            if (error) throw error
            setMessages([])
            toast.success("Chat history cleared")
        } catch (error) {
            console.error("Error clearing chat:", error)
            toast.error("Failed to clear chat")
        }
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                    <div>
                        <h1 className="text-3xl font-bold text-malachite-950 flex items-center gap-2">
                            AI Financial Mentor <span className="text-2xl">🤖</span>
                        </h1>
                        <p className="text-malachite-500 font-medium">Your personal guide to financial freedom</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearChat}
                        className="text-destructive hover:bg-destructive/10 border-malachite-200"
                    >
                        <Trash2 className="h-4 w-4 mr-2" /> Clear History
                    </Button>
                </header>

                <Card className="border-malachite-100 shadow-2xl shadow-malachite-900/5 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col h-[75vh]">
                    <CardHeader className="border-b border-malachite-50 bg-white/50 py-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-malachite-600 flex items-center justify-center text-white shadow-lg shadow-malachite-200">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold text-malachite-950">Gemini 1.5 Flash</CardTitle>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-malachite-500 animate-pulse"></span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-malachite-500">Online & Ready</span>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-2 bg-malachite-50 px-3 py-1.5 rounded-xl border border-malachite-100">
                                <Sparkles className="h-3.5 w-3.5 text-malachite-600" />
                                <span className="text-xs font-bold text-malachite-700">Level {level} Context</span>
                            </div>
                        </div>
                    </CardHeader>

                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                        isTyping={isTyping}
                    />

                    <ChatInput
                        onSendMessage={handleSendMessage}
                        disabled={isTyping}
                    />
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
                    {[
                        "How can I improve my financial score?",
                        "Can I afford a new car with my savings?",
                        "Explain the 50/30/20 rule for my income"
                    ].map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSendMessage(suggestion)}
                            disabled={isTyping}
                            className="text-left p-4 rounded-2xl border border-malachite-100 bg-white/50 hover:bg-white hover:border-malachite-300 transition-all text-xs font-medium text-malachite-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                            "{suggestion}"
                        </button>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}
