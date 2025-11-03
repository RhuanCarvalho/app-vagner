'use client'
import { LoginFormData, loginSchema, useUser } from '@/services/adminServices/login/loginServices';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface LoginPageProps { }

export default function LoginPage({ }: LoginPageProps) {
    const router = useRouter();
    const { state: { loadingAuth, authenticated }, actions: { login, initializeAuth } } = useUser();
    const hasRedirected = useRef(false);

    const { register, getValues, formState: { errors }, trigger } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    // CORRETO: Redirecionamento dentro de useEffect
    useEffect(() => {
        if (authenticated && !hasRedirected.current) {
            hasRedirected.current = true;
            router.push("/admin/budgets");
        }
    }, [authenticated, router]);

    const auth = async () => {
        const isValid = await trigger();

        if (!isValid) {
            return;
        }

        const isAuthenticated = await login({
            email: getValues('email'),
            password: getValues('password'),
        });
        
        if (isAuthenticated) {
            router.push("/admin/budgets");
        }
    }

    // Loading durante verificação inicial
    if (!authenticated && loadingAuth) {
        return (
            <div className="bg-[#000E1B] flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    // Se está autenticado, mostra apenas loading (enquanto redireciona)
    if (authenticated) {
        return (
            <div className="bg-[#000E1B] flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    // Renderiza o formulário apenas se NÃO estiver autenticado
    return (
        <div className="bg-[#000E1B] flex justify-center items-center h-screen">
            <div className="border-white border-2 bg-[#000E1B] opacity-90 min-w-80 rounded-2xl flex flex-col justify-center items-center py-14">
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
                    {loadingAuth ? "Entrando..." : "Entrar"}
                </button>
            </div>
        </div>
    );
}