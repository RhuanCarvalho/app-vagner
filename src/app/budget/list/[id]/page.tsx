"use client"

import { Container } from "@/components/containers/defaultContainer";
import { HeaderTemplate } from "@/components/header/header";
import { useParams } from "next/navigation"
import { Tabs } from "./tabs/tabs";
import { useState } from "react";
import { BudgetsPage } from "./BudgetsPage/BudgetsPage";
import { AppointmentsPage } from "../AppointmentsPage/AppointmentsPage";

interface ListBudgetsPageProps {

}

export default function ListBudgetsPage({}:ListBudgetsPageProps){
    const params = useParams();
    const id = params?.id as string;

    const[selectedTab, setSelectedTab] = useState<'budgets'|'appointments'>('budgets');

    return (
        <Container>
            <HeaderTemplate />
            <Tabs
                options={
                    [
                        { title: "Orçamentos", value: "budgets" },
                        { title: "Agendamentos", value: "appointments" },
                    ]
                }
                selected={selectedTab}
                onChange={setSelectedTab}
                />
            <div className="w-full">
                {selectedTab === 'budgets' && <BudgetsPage id={id} />}
                {selectedTab === 'appointments' && <AppointmentsPage />}
            </div>
        </Container>
    )
}