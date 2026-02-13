import MainLayout from '@/layouts/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'

export default function Education() {
    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Education</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Learn financial literacy with curated courses.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <div className="aspect-video bg-slate-100 relative group cursor-pointer hover:bg-slate-200 transition-colors flex items-center justify-center">
                                <PlayCircle className="h-12 w-12 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg">Financial Basics {i}</CardTitle>
                                <CardDescription>Master the fundamentals of personal finance.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">Start Lesson</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}
