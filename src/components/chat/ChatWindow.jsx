import { useRef, useEffect } from 'react'
import { Bot, Loader2 } from 'lucide-react'
import ChatMessage from './ChatMessage'

export default function ChatWindow({ messages, isLoading, isTyping }) {
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages, isTyping])

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-6 min-h-[400px] max-h-[600px] scrollbar-thin scrollbar-thumb-malachite-200 scrollbar-track-transparent"
        >
            {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60 py-12">
                    <div className="h-16 w-16 bg-malachite-100 rounded-full flex items-center justify-center text-malachite-600">
                        <Bot className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-malachite-900 font-bold text-lg">Your AI Financial Mentor</p>
                        <p className="text-malachite-500 text-sm max-w-[250px]">Ask me anything about your budget, goals, or financial plan.</p>
                    </div>
                </div>
            )}

            {messages.map((msg, index) => (
                <ChatMessage key={msg.id || index} message={msg} />
            ))}

            {isTyping && (
                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="h-8 w-8 rounded-full bg-malachite-600 flex items-center justify-center text-white shrink-0">
                        🤖
                    </div>
                    <div className="bg-white border border-malachite-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-malachite-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-malachite-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-malachite-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
