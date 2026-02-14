import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge as UiBadge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Star, Trophy, Award, CheckCircle2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BadgeGrid({ userBadges = [] }) {
    const [selectedBadge, setSelectedBadge] = useState(null)

    // Define all possible badges to show locked state
    const ALL_BADGES = [
        { id: 1, name: 'Starter Planner', description: 'Created your first financial goal', icon: Star, requirement: 'Create 1 target goal' },
        { id: 2, name: 'Wealth Explorer', description: 'Reached Level 3 in the financial academy', icon: Trophy, requirement: 'Reach Level 3' },
        { id: 3, name: 'Consistency Pro', description: 'Completed 5 financial actions in a row', icon: Award, requirement: '5 Actions Completed' },
    ]

    return (
        <div className="w-full">
            <h3 className="text-sm font-bold text-malachite-950 mb-6 px-1 uppercase tracking-widest opacity-70">Achievements</h3>

            <div className="grid grid-cols-3 gap-3">
                {ALL_BADGES.map((badge) => {
                    const isUnlocked = userBadges.some(ub => ub.name === badge.name)
                    const Icon = badge.icon

                    return (
                        <div
                            key={badge.id}
                            onClick={() => setSelectedBadge({ ...badge, isUnlocked })}
                            className={cn(
                                "group relative flex flex-col items-center p-4 rounded-3xl border transition-all duration-500 cursor-pointer text-center min-h-[220px]",
                                isUnlocked
                                    ? "bg-white border-malachite-100 shadow-sm hover:shadow-md hover:-translate-y-1"
                                    : "bg-malachite-50/20 border-transparent opacity-40 hover:opacity-100"
                            )}
                        >
                            {/* Badge Icon Container */}
                            <div className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
                                isUnlocked
                                    ? "bg-malachite-50 text-malachite-500 ring-2 ring-malachite-100 group-hover:scale-110"
                                    : "bg-malachite-100/50 text-malachite-300"
                            )}>
                                <Icon className={cn("h-6 w-6", isUnlocked ? "fill-malachite-500/20" : "")} />
                            </div>

                            {/* Badge Info */}
                            <div className="flex-1 flex flex-col">
                                <h4 className={cn(
                                    "text-xs font-bold leading-tight mb-2 px-1",
                                    isUnlocked ? "text-malachite-900" : "text-malachite-400"
                                )}>
                                    {badge.name}
                                </h4>

                                <p className="text-[10px] text-malachite-400 leading-relaxed mb-3 line-clamp-3">
                                    {badge.description}
                                </p>
                            </div>

                            {/* Status Label - Unified Position */}
                            <div className="mt-auto pt-2">
                                {isUnlocked ? (
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-malachite-600">
                                        Unlocked
                                    </span>
                                ) : (
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-malachite-200">
                                        Locked
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal remains same - it's already updated */}

            {/* Achievement Detail Dialog */}
            <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
                <DialogContent className="sm:max-w-md bg-white border-malachite-100 rounded-3xl">
                    {selectedBadge && (
                        <div className="flex flex-col items-center text-center p-4">
                            <div className={cn(
                                "h-24 w-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl",
                                selectedBadge.isUnlocked
                                    ? "bg-malachite-600 text-white shadow-malachite-200 animate-in zoom-in duration-500"
                                    : "bg-malachite-100 text-malachite-300 shadow-neutral-100"
                            )}>
                                <selectedBadge.icon className="h-12 w-12" />
                            </div>

                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-malachite-950 mb-2">
                                    {selectedBadge.name}
                                </DialogTitle>
                                <DialogDescription className="text-malachite-600 text-base mb-6">
                                    {selectedBadge.description}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="w-full bg-malachite-50/50 p-4 rounded-2xl border border-malachite-100 mb-6">
                                <p className="text-xs font-bold text-malachite-400 uppercase tracking-widest mb-1">Requirement</p>
                                <p className="text-malachite-900 font-medium">{selectedBadge.requirement}</p>
                            </div>

                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setSelectedBadge(null)}
                                    className="flex-1 bg-malachite-600 text-white font-bold py-3 rounded-xl hover:bg-malachite-700 transition-colors shadow-lg shadow-malachite-200 active:scale-95"
                                >
                                    {selectedBadge.isUnlocked ? 'Great Job!' : 'Close'}
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
