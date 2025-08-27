'use client'
import { LoginFormData, loginSchema, useUser } from '@/services/adminServices/login/loginServices';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';


interface LoginPageProps { }

export default function LoginPage({ }: LoginPageProps) {

    const router = useRouter();

    const { state: { loadingAuth }, actions: { login } } = useUser();

    const { register, getValues, formState: { errors }, trigger } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });


    const auth = async () => {
        const isValid = await trigger();

        if (!isValid) {
            return;
        }

        const isAuthenticated = await login({
            email: getValues('email'),
            password: getValues('password'),
        });
        console.log("isAuthenticated", isAuthenticated)
        if (isAuthenticated) {
            router.push("/admin/home");
        }
    }


    return (
        <>
            <div className="bg-[#000E1B] flex justify-center items-center h-full">
                <div className="border-white border-2 bg-[#000E1B] opacity-90 min-w-80 rounded-2xl flex flex-col justify-center items-center py-14">
                    {/* <img src="/painel/link/capacete.svg" alt="" /> */}
                    <img className="w-18" src="/capacete.svg" alt="" />
                    <div className="p-6 flex flex-col justify-center items-center gap-2 w-full">
                        <input
                            placeholder="E-mail"
                            className="text-white text-[12px] border border-slate-300 p-2 rounded-lg w-full"
                            type="text"
                            {...register('email')}
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}

                        <input
                            placeholder="Senha"
                            className="text-white text-[12px] border border-slate-300 p-2 rounded-lg w-full"
                            type="password"
                            {...register('password')}
                        />
                        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}

                    </div>
                    <button
                        onClick={loadingAuth ? undefined : auth}
                        disabled={loadingAuth}
                        className={`${loadingAuth ? "cursor-progress" : "cursor-pointer"} bg-white font-bold px-4 py-2 rounded-lg hover:scale-105 transition-all`}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </>
    )
}