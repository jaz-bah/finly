import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import AddRecurringForm from "../form/AddRecurringForm"




export function AddRecurringModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Recurring
                    <Plus />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Recurring</DialogTitle>
                </DialogHeader>

                <AddRecurringForm />
            </DialogContent>
        </Dialog>
    )
}
