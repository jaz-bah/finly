import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BCardSkltn() {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="flex flex-col sm:flex-row w-full h-full justify-between">
          <div className="flex w-full sm:w-1/2 flex-col px-0 sm:px-2 py-2 sm:py-0 items-center justify-center">
            <Skeleton className="h-10 w-32 sm:w-48 mb-4" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex w-full sm:w-1/2 flex-col px-0 sm:px-2 py-2 sm:py-0 items-center justify-center border-t-2 sm:border-t-0 sm:border-l-2 border-border gap-2">
            <Skeleton className="h-20 w-40 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
