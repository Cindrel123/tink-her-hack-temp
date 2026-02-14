import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '@/hooks/useAuth'

export default function ChatMessage({ message }) {
    const { user } = useAuth()
    const isUser = message.role === 'user'

    return (
        <div className={cn(
            "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500",
            isUser ? "flex-row-reverse" : "flex-row"
        )}>
            {/* Avatar */}
            <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm",
                isUser
                    ? "bg-malachite-100 text-malachite-700 border border-malachite-200"
                    : "bg-malachite-600 text-white"
            )}>
                {isUser ? (user?.email?.charAt(0).toUpperCase() || 'U') : '🤖'}
            </div>

            {/* Bubble */}
            <div className={cn(
                "max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                isUser
                    ? "bg-malachite-600 text-white rounded-tr-none"
                    : "bg-white border border-malachite-100 text-malachite-900 rounded-tl-none"
            )}>
                <div className={cn(
                    "prose prose-sm max-w-none",
                    isUser ? "prose-invert" : "prose-neutral"
                )}>
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                </div>
                <span className={cn(
                    "text-[10px] block mt-1 opacity-50",
                    isUser ? "text-right" : "text-left"
                )}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    )
}
