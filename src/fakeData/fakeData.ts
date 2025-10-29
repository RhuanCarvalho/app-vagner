import { CardBudgetProps } from "@/app/admin/(AdminAuthentication)/budgets/components/Cards";

interface Service {
    name_service: string;
    value: number | null;
}

export interface BudgetProps {
    status: string;
    label_status: string;
    car: string;
    km: string;
    expire: string;
    genero: string;
    idade: string;
    prazo: string;
    periodo: string;
    start_hour: string;
    end_hour: string;
    services: Service[];
}


// all
// answered
// pending
// expired

// declined
// approved

export const users = [
    {
        finishedNumberCell: '1234',
        budgets: [
            {
                status: 'pending',
                label_status: '1 dia',
                car: 'Ford Ka 2011',
                km: '30.000',
                expire: '1 dia',
                genero: 'Homem',
                idade: '30',
                prazo: 'Hoje',
                periodo: 'tarde',
                start_hour: '14:00',
                end_hour: '15:30',
                services: [
                    {
                        name_service: 'Troca de óleo',
                        value: 120
                    },
                    {
                        name_service: 'Alinhamento',
                        value: null
                    },
                    {
                        name_service: 'Balanceamento',
                        value: 7.56
                    },
                    {
                        name_service: 'Troca de filtro de ar',
                        value: 666.5
                    },
                    {
                        name_service: 'Revisão completa',
                        value: 22.38
                    }
                ]
            },
            {
                status: 'answered',
                label_status: 'Ganhou',
                car: 'Honda Civic 2015',
                km: '70.000',
                expire: '2 dias',
                genero: 'Mulher',
                idade: '40',
                prazo: 'Amanhã',
                periodo: 'manhã',
                start_hour: '08:30',
                end_hour: '10:00',
                services: [
                    { name_service: 'Troca de pastilhas de freio', value: 250 },
                    { name_service: 'Troca de óleo', value: 130 },
                    { name_service: 'Revisão geral', value: 500 }
                ]
            },
            {
                status: 'expired',
                label_status: 'Expirou',
                car: 'Chevrolet Onix 2020',
                km: '15.000',
                expire: 'Expirado',
                genero: 'Homem',
                idade: '25',
                prazo: 'Semana passada',
                periodo: 'noite',
                start_hour: '19:00',
                end_hour: '20:30',
                services: [
                    { name_service: 'Troca de bateria', value: 450 },
                    { name_service: 'Alinhamento e balanceamento', value: 90 },
                    { name_service: 'Reparo no ar-condicionado', value: null }
                ]
            },
            {
                status: 'answered',
                label_status: 'Perdeu',
                car: 'Toyota Corolla 2018',
                km: '50.000',
                expire: '3 dias',
                genero: 'Mulher',
                idade: '35',
                prazo: 'Ontem',
                periodo: 'tarde',
                start_hour: '13:30',
                end_hour: '15:00',
                services: [
                    { name_service: 'Troca de velas', value: 200 },
                    { name_service: 'Troca de óleo', value: 140 }
                ]
            },
            {
                status: 'answered',
                label_status: 'Ganhou',
                car: 'Volkswagen Gol 2014',
                km: '80.000',
                expire: '5 dias',
                genero: 'Homem',
                idade: '28',
                prazo: 'Hoje',
                periodo: 'manhã',
                start_hour: '09:00',
                end_hour: '10:30',
                services: [
                    { name_service: 'Revisão geral', value: 600 },
                    { name_service: 'Troca de amortecedores', value: 800 },
                    { name_service: 'Troca de óleo', value: 110 }
                ]
            }
        ]
    },

    {
        finishedNumberCell: '4321',
        budgets: [
            {
                status: 'expired',
                label_status: 'Expirou',
                car: 'Chevrolet Onix 2020',
                km: '15.000',
                expire: 'Expirado',
                genero: 'Homem',
                idade: '25',
                prazo: 'Semana passada',
                periodo: 'noite',
                start_hour: '19:00',
                end_hour: '20:30',
                services: [
                    { name_service: 'Troca de bateria', value: 450 },
                    { name_service: 'Alinhamento e balanceamento', value: 90 },
                    { name_service: 'Reparo no ar-condicionado', value: null }
                ]
            },
            {
                status: 'answered',
                label_status: 'Perdeu',
                car: 'Toyota Corolla 2018',
                km: '50.000',
                expire: '3 dias',
                genero: 'Mulher',
                idade: '35',
                prazo: 'Ontem',
                periodo: 'tarde',
                start_hour: '13:30',
                end_hour: '15:00',
                services: [
                    { name_service: 'Troca de velas', value: 200 },
                    { name_service: 'Troca de óleo', value: 140 }
                ]
            }
        ]
    }
];



export const fakeBudgetsPageBudgets: CardBudgetProps[] = [
    {
        index: '#101',
        name: 'José Silva',
        services: 'Troca de oleo, troca pneu',
        status: "Pendente"
    },
    {
        index: '#111',
        name: 'Alvares Dornelas',
        services: 'Martelinho',
        status: "Finalizado"
    },
    {
        index: '#125',
        name: 'Juliana Camargo',
        services: 'Alinhamento',
        status: "Pendente"
    },
    {
        index: '#058',
        name: 'Fulano de Tal',
        services: 'Reparo motor',
        status: "Recusado"
    },
    {
        index: '#001',
        name: 'Umestranho Qualquer',
        services: 'Algum serviço, outro serviço',
        status: "Aguardando confirmação de nova data"
    },
]
