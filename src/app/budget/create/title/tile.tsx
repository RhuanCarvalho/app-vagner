interface TitleHeaderProps {
    title: string;
}

export const TitleHeader = ({ title }: TitleHeaderProps) => {
    return (
        <div className="w-full flex px-5 max-w-lg">
            <div className="w-full py-3 rounded-full flex justify-center bg-blue-500 shadow-lg">
                <h1 className="text-white font-bold text-2xl">{title}</h1>
            </div>
        </div>
    )
} 