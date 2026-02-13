import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PartyPopper } from 'lucide-react'

export default function RewardDialog({ open, onOpenChange, title, message }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto bg-yellow-100 p-3 rounded-full w-fit mb-4">
                        <PartyPopper className="h-8 w-8 text-yellow-600" />
                    </div>
                    <DialogTitle className="text-center text-2xl">{title || "Congratulations!"}</DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        Awesome!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
