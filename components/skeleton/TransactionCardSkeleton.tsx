import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionCardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader className="flex justify-between">
                <div className="flex-grow">
                    {/* Title */}
                    <Skeleton className="h-6 w-1/4 rounded-md mb-2" />

                    {/* Description */}
                    <Skeleton className="h-4 w-1/3 rounded-md" />
                </div>

                {/* View all button */}
                <Skeleton className="h-8 w-20 rounded-md" />
            </CardHeader>

            <CardContent>
                <div className="flex w-full justify-between">
                    <div className="flex flex-col gap-2">
                        {/* Amount */}
                        <Skeleton className="h-10 w-1/2 rounded-md" />

                        {/* Badge or additional info */}
                        <Skeleton className="h-5 w-1/4 rounded-md" />
                    </div>

                    {/* Icon */}
                    <Skeleton className="h-12 w-12 rounded-full" />
                </div>
            </CardContent>
        </Card>
    );
}
