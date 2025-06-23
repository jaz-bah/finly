import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "../ui/card"

export function TableSkeleton() {
    return (
        <Card className="p-4 mt-6">
            <CardContent>
                <div className="p-4">
                    {/* Search and Action row skeleton */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <Skeleton className="h-10 w-1/3 rounded-md" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32 rounded-md" />
                            <Skeleton className="h-10 w-32 rounded-md" />
                        </div>
                    </div>

                    {/* Table header row */}
                    <div className="flex px-4 py-2 border-b">
                        <Skeleton className="h-5 w-5 mr-4 rounded-md" />
                        <Skeleton className="h-5 w-20 mr-4 rounded-md" />
                        <Skeleton className="h-5 w-32 mr-4 rounded-md" />
                        <Skeleton className="h-5 w-32 mr-4 rounded-md" />
                        <Skeleton className="h-5 w-32 mr-4 rounded-md" />
                        <Skeleton className="h-5 w-20 rounded-md" />
                    </div>

                    {/* Repeat for several table rows */}
                    {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="flex px-4 py-2 border-b">
                            <Skeleton className="h-5 w-5 mr-4 rounded-md" />
                            <Skeleton className="h-5 w-20 mr-4 rounded-md" />
                            <Skeleton className="h-5 w-32 mr-4 rounded-md" />
                            <Skeleton className="h-5 w-32 mr-4 rounded-md" />
                            <Skeleton className="h-5 w-32 mr-4 rounded-md" />
                            <Skeleton className="h-5 w-20 rounded-md" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
