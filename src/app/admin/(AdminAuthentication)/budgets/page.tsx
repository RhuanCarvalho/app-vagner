import { fakeBudgetsPageBudgets } from "@/fakeData/fakeData";
import { CardBudget } from "./components/Cards";

interface BudgetsPageProps {

}

export default function BudgetsPage({ }: BudgetsPageProps) {
    return (
        <div className="flex flex-wrap gap-4 p-4">
            {fakeBudgetsPageBudgets.map((bud) => (
                <CardBudget key={bud.index}  {...bud} />
            ))}
        </div>
    )
}