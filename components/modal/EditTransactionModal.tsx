import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ITransaction } from "@/types/transaction.type"
import EditTransactionForm from "../form/EditTransactionForm"


interface Props {
    transaction: ITransaction,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void;
}

export function EditTransactionModal({ transaction, isOpen, setIsOpen }: Props) {

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                </DialogHeader>

                <EditTransactionForm transaction={transaction} />
            </DialogContent>
        </Dialog>
    )
}
