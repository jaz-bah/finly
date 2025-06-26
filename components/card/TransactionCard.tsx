import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { moneyFormatter } from "@/helper/formater";
import {
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  HandCoins,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import GrouthBadge from "../badge/GrouthBadge";
import TransactionCardSkeleton from "../skeleton/TransactionCardSkeleton";
import { Button } from "../ui/button";

interface Props {
  type: string;
  total: number;
  prevTotal?: number;
  isLoading?: boolean;
  url?: string;
}

export default function TransactionCard({ type, total, prevTotal, isLoading, url }: Props) {

  const descriptionGenerator = (type: string) => {
    switch (type) {
      case "income":
        return "Total income of June 2025";
      case "expense":
        return "Total expense of June 2025";
      case "saving":
        return "Total savings of June 2025";
      case "total savings":
        return "Total savings of all time";
      default:
        return "";
    }
  };

  if (isLoading) return <TransactionCardSkeleton />;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg font-bold capitalize">{type}</h1>
        </CardTitle>
        <CardDescription className="hidden sm:block">{descriptionGenerator(type)}</CardDescription>

        {url ? (
          <CardAction className="flex justify-end">
            <Button
              variant="outline"
              className="cursor-pointer"
              size="sm"
              asChild
            >
              <Link href={url}>View all</Link>
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="flex w-full justify-between">
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">{moneyFormatter(total)}</h2>
              {prevTotal ? <GrouthBadge total={total} prevTotal={prevTotal} inverse={type === "expense"} /> : null}
            </div>

            <p className="text-sm font-bold">{""}</p>
          </div>

          <div
            className={`icon h-fit border-2 border-border rounded-full p-1 md:p-2 ${type === "income"
              ? "bg-green-500/10"
              : type === "expense"
                ? "bg-red-500/10"
                : type === "saving"
                  ? "bg-blue-500/10"
                  : type === "total savings"
                    ? "bg-yellow-500/10"
                    : "bg-gray-500/10"
              }`}
          >
            {type === "income" && (
              <BanknoteArrowUpIcon className="w-5 h-5 lg:w-10 lg:h-10 text-primary" />
            )}
            {type === "expense" && (
              <BanknoteArrowDownIcon className="w-5 h-5 lg:w-10 lg:h-10 text-primary" />
            )}
            {type === "saving" && (
              <PiggyBank className="w-5 h-5 lg:w-10 lg:h-10 text-primary" />
            )}
            {type === "total savings" && (
              <HandCoins className="w-5 h-5 lg:w-10 lg:h-10 text-primary" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
