import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSidebar } from "../ui/sidebar"
import useScroll from "@/hooks/use-scroll"
import { Plus } from "lucide-react"
import AddTransactionForm from "../form/AddTransactionForm"




export function AddTransactionModal() {
    const { isMobile } = useSidebar();
    const scrolled = useScroll();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className={`
                        ${scrolled ? "fixed bottom-5 right-5 z-50" : ""} 
                        ${isMobile ? "w-12 h-12 rounded-full bottom-20 fixed right-5 z-50" : "bottom-5"}
                    `}
                >
                    {isMobile ? <Plus /> : (
                        <>
                            Transaction <Plus />
                        </>
                    )}

                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>

                <AddTransactionForm />
            </DialogContent>
        </Dialog>
    )
}
