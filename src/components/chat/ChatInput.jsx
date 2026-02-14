import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'

export default function ChatInput({ onSendMessage, disabled }) {
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.trim() && !disabled) {
            onSendMessage(message)
            setMessage('')
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-malachite-100 bg-white/50 backdrop-blur-sm flex items-center gap-2"
        >
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                disabled={disabled}
                className="flex-1 bg-white border-malachite-200 focus-visible:ring-malachite-500 rounded-xl"
            />
            <Button
                type="submit"
                disabled={!message.trim() || disabled}
                className="bg-malachite-600 hover:bg-malachite-700 text-white rounded-xl w-12 h-10 p-0 shadow-lg shadow-malachite-200 active:scale-90 transition-all"
            >
                <SendHorizontal className="h-5 w-5" />
            </Button>
        </form>
    )
}
