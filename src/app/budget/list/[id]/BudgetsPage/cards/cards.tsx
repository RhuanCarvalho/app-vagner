interface CardsViewProps {
    car: string;
    start_hour: string;
    end_hour: string;
    service: string;
    label_status: string;
}


const colors: Record<string, string> = {
    Ganhou: "bg-green-500",
    Perdeu: "bg-red-500",
    Expirou: "bg-yellow-500",
};

interface StatusTagProps {
    label_status: string;
}

const StatusTag = ({ label_status }: StatusTagProps) => {
    const colorClass = colors[label_status] || "bg-blue-500";

    return (
        <div className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold text-white ${colorClass}`}>
            {label_status}
        </div>
    );
};

export const CardsView = ({ car, start_hour, end_hour, service, label_status }: CardsViewProps) => {
    return (
        <div className="transition-all py-2 px-6 cursor-pointer active:scale-[102%]">
            <div className="p-5 border border-slate-300 rounded-3xl flex justify-between items-start">
                <div className="flex flex-col gap-6">
                    <p className="font-bold text-lg">{car}</p>
                    <div>
                        <p className="font-semibold text-sm">{service}</p>
                        <p className="font-semibold text-medium">{start_hour} - {end_hour}</p>
                    </div>
                </div>
                <div>
                <StatusTag  label_status={label_status}/>
                </div>
            </div>
        </div>
    )
}