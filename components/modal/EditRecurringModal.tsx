import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { IRecurring } from "@/types/recurring.types";
import EditRecurringForm from "../form/EditRecurringForm";


interface Props {
    recurring: IRecurring,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void;
}

export function EditRecurringModal({ recurring, isOpen, setIsOpen }: Props) {

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Recurring</DialogTitle>
                </DialogHeader>

                <EditRecurringForm recurring={recurring} />
            </DialogContent>
        </Dialog>
    )
}
