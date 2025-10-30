import { Divider } from "@/components/divider/divider";

interface SubTitleProps {
    message: string;
}

export const SubTitle = ({ message }: SubTitleProps) => {
    return (
        <div className="px-6 py-1 pt-5">
            <h3 className="font-bold text-medium">{message}</h3>
            <Divider />
        </div>
    )
}