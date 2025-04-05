"use client"

import { Container } from "@/components/containers/defaultContainer";
import { HeaderTemplate } from "@/components/header/header";
import { useParams, useRouter } from "next/navigation";
import { TitleHeader } from "./title/tile";
import { users } from "@/fakeData/fakeData";
import { SubTitle } from "./title/subTitle";
import { Divider } from "../../../components/divider/divider";
import { formatCurrency, InputValueServices } from "./input-value-services.tsx/input-values-services";
import FileUpload, { FileWithPreview } from "@/components/addFiles/file-upload";
import { useAllServices } from "@/services/allServices";
import MediaGallery, { MediaItem } from "@/components/galleryMedias";
import { useEffect, useState } from "react";
import { ConfirmationSendBugdget } from "./confirmSend/confirmSend";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Cog, CalendarPlus, X } from "lucide-react"
import { ModalAddDate } from "./modalAddDate/modalAddDate";

type ServiceForm = {
    service: string;
    value: number;
};

type BudgetForm = {
    services: ServiceForm[];
    additionalInfo: string;
};

interface BudgetCreatePageProps {
}

export default function BudgetCreatePage({ }: BudgetCreatePageProps) {
    const router = useRouter()
    const { state: { budget, checkinData }, actions: { sendBudget } } = useAllServices()
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const handleFiles = (files: FileWithPreview[]) => setFiles(files);
    const [ok, setOk] = useState(false);

    const { control, watch, setValue } = useForm<BudgetForm>({
        defaultValues: {
            services: budget?.services?.map(service => ({
                ...service,
                value: Number(service.value) || 0, // Converte para número
            })) || [],
            additionalInfo: "",
        },
    });


    // Observar mudanças no formulário
    const services = watch("services");
    const additionalInfo = watch("additionalInfo");

    // Calcular total
    const total = services.reduce((sum, service) => sum + Number(service.value || 0), 0);

    // Atualizar os valores sempre que `budget.services` mudar
    useEffect(() => {
        if (budget?.services) {
            setValue("services", budget?.services?.map(service => ({
                ...service,
                value: Number(service.value) || 0, // Converte para número
            })));
        }
    }, [budget, setValue]);

    const [openAddDate, setOpenAddDate] = useState(false);
    const handleAddDateOpen = () => {
        setOpenAddDate(true)
    };
    const handleAddDateClose = () => {
        setOpenAddDate(false);
    };


    const [newDate, setNewDate] = useState<any | undefined>();
    const handleDateChange = (newDate: any) => {
        setNewDate(newDate);
    };


    const handleResponseClick = async () => {
        const formData = new FormData();

        // Add sugestão de data caso esteja preenchida
        if (!!newDate) {
            formData.append("suggested_date", JSON.stringify(newDate));
        }

        // Adicionar os serviços como um JSON stringificado
        formData.append("services", JSON.stringify(services));

        // Adicionar o campo adicional
        formData.append("additionalInfo", additionalInfo);

        // Adicionar os arquivos ao FormData
        files.forEach((file, index) => {
            formData.append(`files`, file.file); // `file.file` deve ser um objeto File válido
        });

        const isValid = await sendBudget(formData);

        if (isValid) {
            setOk(true);
        } else {
            alert('Houve um erro, tente novamente!')
        }

    };

    const viewListBudgets = () => {
        router.push('/budget/list/1234');
    }

    return (
        <Container>
            <div>
                <HeaderTemplate />
                {!ok
                    ?
                    <>
                        <TitleHeader title={budget?.car!} />
                        <div className="w-max px-6 pt-8">
                            <p className="bg-blue-500 text-white shadow-lg font-medium text-lg px-8 py-1 rounded-lg">Expira em {budget?.approval_expires_at}</p>
                        </div>
                        <div>
                            <SubTitle message='Sobre o agendamento' />
                            <div className="px-6">
                                <div className="w-full flex justify-between py-1 items-center">
                                    <p className="text-start max-w-[68%]">{budget?.car}</p>
                                    {/* <p>-</p> */}
                                    <p className="min-w-max">{budget?.km} KM</p>
                                    {/* <p>-</p>
                                    <p className="min-w-max">{budget?.genero} {budget?.idade} anos</p> */}
                                </div>
                                <Divider />
                                <div className="w-full flex justify-between py-1 items-center">
                                    <p>Data</p>
                                    {/* <p>{budget?.date_schedule}, período da {budget?.periodo}</p> */}
                                    <p>{dayjs(budget?.date_schedule).format("DD/MM/YYYY")}, período da {budget?.periodo}</p>
                                </div>
                                {
                                // checkinData.type === "estimate" && (
                                    !newDate ?
                                        <div className="pt-4">
                                            <Button onClick={handleAddDateOpen} variant="outline" size="sm" className="w-full cursor-pointer" type="button" asChild>
                                                <span>
                                                    <CalendarPlus className="mr-2 h-4 w-4" />
                                                    Sugerir data
                                                </span>
                                            </Button>
                                        </div>
                                        :
                                        <div className="mt-4 flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
                                            <div className="w-full flex justify-between">
                                                <div className=" text-green-500 flex h-8 items-center rounded-md bg-muted">
                                                    Sugestão de nova data:
                                                </div>
                                                <div className="min-w-0 flex flex-col items-center justify-end">
                                                    <p className="text-green-500 truncate font-medium">{newDate.date}</p>
                                                    <p className="text-green-500 text-xs text-muted-foreground font-medium">período da {newDate.period}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setNewDate(undefined);
                                                    // removeFile(fileData.id)
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remover arquivo</span>
                                            </Button>
                                        </div>
                                // )
                                }
                                <Divider />
                            </div>
                            <SubTitle message='Serviços' />
                            <div className="px-6">
                                {services.map((service, index) => (
                                    <div key={index} className="w-full flex justify-between py-1 items-center">
                                        <p>{service.service}</p>
                                        <Controller
                                            control={control}
                                            name={`services.${index}.value`}
                                            render={({ field }) => (
                                                <InputValueServices
                                                    {...field}
                                                    value={Number(field.value) || 0} // Converte o valor para número
                                                    onChange={(e) => field.onChange(Number(e))} // Garante que o estado armazene um número
                                                />
                                            )}
                                        />

                                    </div>

                                ))}
                                <div className="font-semibold mt-3">
                                    <div className="w-full flex justify-end gap-3 py-1 items-center">
                                        <p>Total:</p>
                                        <p>{formatCurrency(total)}</p>
                                    </div>
                                </div>
                                {/* {checkinData.type === "estimate" && */}
                                    <div className="pt-2">
                                        <Button variant="outline" size="sm" className="w-full cursor-pointer" type="button" asChild>
                                            <span>
                                                <Cog className="mr-2 h-4 w-4" />
                                                Adicionar serviços
                                            </span>
                                        </Button>
                                    </div>
                                {/* } */}
                            </div>
                            <div>
                                <SubTitle message='Medias' />
                                <div className="px-6">
                                    <MediaGallery items={budget.media} />
                                </div>
                            </div>
                            <SubTitle message='Arquivos Adicionais' />
                            <div className="w-full flex justify-center px-6">
                                <FileUpload handleFiles={handleFiles} />
                            </div>

                            <SubTitle message='Informações adicionais' />
                            <div className="px-6">
                                <Controller
                                    control={control}
                                    name="additionalInfo"
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="w-full border-slate-300 border-1 rounded-lg h-32 p-2 shadow-lg resize-none"
                                            placeholder="Digite aqui..."
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex justify-center items-center p-2">
                                <button
                                    onClick={handleResponseClick}
                                    className="transition-all w-[60%] bg-blue-500 rounded-full active:scale-105 active:bg-blue-600 hover:bg-blue-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                                >
                                    Responder
                                </button>
                            </div>
                            <div className="flex justify-center items-center p-2">
                                <button
                                    onClick={()=>{}}
                                    className="transition-all w-[60%] bg-red-500 rounded-full active:scale-105 active:bg-red-600 hover:bg-red-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                                >
                                    Declinar
                                </button>
                            </div>
                        </div>

                    </>
                    :
                    <ConfirmationSendBugdget onClick={viewListBudgets} />
                }
            </div>
            <ModalAddDate
                isOpen={openAddDate}
                onClose={handleAddDateClose}
                saveInfo={handleDateChange}
            />
        </Container>
    )
}