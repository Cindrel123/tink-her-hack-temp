import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gauge } from 'lucide-react'

export default function FinancialScoreCard({ score }) {
    // Determine Color
    let colorClass = "text-red-500"
    if (score >= 50) colorClass = "text-yellow-500"
    if (score >= 80) colorClass = "text-green-500"

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                    Financial Health Score
                </CardTitle>
                <Gauge className={`h-4 w-4 ${colorClass}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${colorClass}`}>{score} / 100</div>
                <p className="text-xs text-slate-500 mt-1">
                    Based on savings, goals & consistency.
                </p>
            </CardContent>
        </Card>
    )
}
