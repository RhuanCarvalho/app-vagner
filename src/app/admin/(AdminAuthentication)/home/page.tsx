'use client'
import { useUser } from "@/services/adminServices/login/loginServices"

interface HomePageProps {

}

export default function HomePage({ }: HomePageProps) {
    const { state: { user } } = useUser();
    return (
        <div className="w-full h-full flex justify-center items-start p-20"><h2 className="font-semibold text-2xl">Olá {user?.company_name}, seja bem vindo!</h2></div>
    )
}