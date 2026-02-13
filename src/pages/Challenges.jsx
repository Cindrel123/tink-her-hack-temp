import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'

export default function Challenges() {
    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
                    <p className="text-slate-500 mt-2">
                        Join community challenges to boost your savings.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                <CardTitle>No Spend November</CardTitle>
                            </div>
                            <CardDescription>Save big by cutting non-essential spending.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4">
                                Join 5,432 participants in this month's challenge.
                            </p>
                            <Button>Join Challenge</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}
