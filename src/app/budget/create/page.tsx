'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { Container } from "@/components/containers/defaultContainer";
import { HeaderTemplate } from "@/components/header/header";
import { useRouter } from "next/navigation";
import { TitleHeader } from "./title/tile";
import { SubTitle } from "./title/subTitle";
import { Divider } from "../../../components/divider/divider";
import { formatCurrency, InputValueServices } from "./input-value-services.tsx/input-values-services";
import FileUpload, { FileWithPreview } from "@/components/addFiles/file-upload";
import { useAllServices } from "@/services/allServices";
import MediaGallery from "@/components/galleryMedias";
import { useEffect, useState } from "react";
import { ConfirmationSendBugdget } from "./confirmSend/confirmSend";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { PackagePlus, CalendarPlus, X, Trash2 } from "lucide-react"
import { ModalAddDate } from "./modalAddDate/modalAddDate";
import { ModalAddService } from "./modalAddService/modalAddService";
import { ModalConfirmeDecline } from "./confirmDecline/confirmDecline";
import { ConfirmDeclineBugdget } from "./messageDecline/messageDecline";
import "./style.css";
import CustomCheckbox from "@/components/customCheckbox/customCheckboxConfirmDate";
import { ModalLastConfirmation } from "./lastConfirmation/lastConfirmation";

export type ServiceForm = {
    id_service_item: string;
    id_service?: string;
    service: string;
    value: number;
    id_categoria?: string,
    categoria?: string,
    isNew?: boolean;
    randomId?: string;
};

type BudgetForm = {
    services: ServiceForm[];
    additionalInfo: string;
};

interface BudgetCreatePageProps {
}

export default function BudgetCreatePage({ }: BudgetCreatePageProps) {
    const router = useRouter()
    const { state: { budget, checkinData }, actions: { sendBudget, RejectedService } } = useAllServices()
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
        sendGAEvent('event', `botao_abrir_modal_para_add_data`, {});
    };
    const handleAddDateClose = () => {
        setOpenAddDate(false);
    };


    const [newDate, setNewDate] = useState<{
        suggestions: { date: string; period: string }[];
        observation: string;
    }>({ suggestions: [], observation: '' });
    const handleDateChange = (newDate: any) => {
        setNewDate(newDate);
    };

    const [openAddService, setOpenAddService] = useState(false);
    const handleAddServiceOpen = () => {
        setOpenAddService(true)
        sendGAEvent('event', `botao_abrir_modal_para_add_servico`, {});
    };
    const handleAddServiceClose = () => {
        setOpenAddService(false);
    };
    const handleServiceChange = (newService: any) => {
        setValue("services", [...services, newService]);
    };

    const removeServiceItem = (id: string) => {
        setValue("services", services.filter(service => service.randomId !== id));
        sendGAEvent('event', `botao_para_remover_servico`, {});
    }

    const [isCheckedDate, setIsCheckedDate] = useState(false);
    const [activeWarningNoConfirmDate, setActiveWarningNoConfirmDate] = useState(false);

    const handleResponseClick = async () => {

        const formData = new FormData();

        // Add sugestão de data caso esteja preenchida
        if (!!newDate) {
            formData.append("suggested_dates", JSON.stringify(newDate));
        }

        // Adicionar os serviços como um JSON stringificado
        formData.append("services", JSON.stringify(services));

        // Adicionar o campo adicional
        formData.append("additionalInfo", additionalInfo);
        formData.append("type", checkinData.type!);
        formData.append("id", checkinData.id!);
        formData.append("company", checkinData.company!);

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

    const [isDecline, setIsDecline] = useState(false);
    const [confirmDecline, setConfirmDecline] = useState(false);
    const handleConfirmDeclineOpen = () => {
        setConfirmDecline(true)
        sendGAEvent('event', `botao_para_abrir_modal_declinar_orcamento`, {});
    };
    const handleConfirmDeclineClose = () => {
        setConfirmDecline(false);
    };


    const rejectedBudget = () => {
        sendGAEvent('event', `botao_para_confirmar_declinar_orcamento`, {});
        RejectedService({
            id: checkinData.id!,
            type: checkinData.type!,
        })
        setOk(true);
        setIsDecline(true);
    }


    const viewListBudgets = () => {
        router.push('/budget/list/1234');
    }

    const [highlightFirstInput, setHighlightFirstInput] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setHighlightFirstInput(false), 600000);
        return () => clearTimeout(timeout);
    }, []);


    const [modalLastConfirmation, setModalLastConfirmation] = useState(false);

    const handleOpenLastConfirmation = () => {
        if (!isCheckedDate) {
            setActiveWarningNoConfirmDate(true);
            return;
        }
        sendGAEvent('event', `botao_para_abrir_modal_responder_orcamento`, {});
        setModalLastConfirmation(true);
    }

    const handleCancelLastConfirmation = () => {
        setModalLastConfirmation(false);
    }
    
    const handleOkLastConfirmation = () => {
        setModalLastConfirmation(false);
        sendGAEvent('event', `botao_para_confirmar_responder_orcamento`, {});
        handleResponseClick();
    } 
    
    
    
    const btnCofirmDate = (value: boolean) => {
        setIsCheckedDate(value);
        sendGAEvent('event', `botao_para_confirmar_data`, {});
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
                                    <p className={`${(isCheckedDate && newDate.suggestions.length > 0) ? "line-through" : isCheckedDate ? "text-emerald-400 font-semibold" : ""}`}>{dayjs(budget?.date_schedule).format("DD/MM/YYYY")}, período da {budget?.periodo}</p>
                                </div>
                                {
                                    newDate?.suggestions?.map((date: { date: string, period: string }, index: any) => {
                                        return (
                                            <div key={index} className="mt-4 flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
                                                <div className="w-full flex justify-between">
                                                    <div className=" text-emerald-400 flex h-8 items-center rounded-md bg-muted">
                                                        Sugestão de nova data:
                                                    </div>
                                                    <div className="min-w-0 flex flex-col items-center justify-end">
                                                        <p className="text-emerald-400 truncate font-medium">{date.date}</p>
                                                        <p className="text-emerald-400 text-xs text-muted-foreground font-medium">período da {date.period}</p>
                                                    </div>
                                                </div>
                                                {!isCheckedDate ?
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setNewDate((prev: any) => ({
                                                                ...prev,
                                                                suggestions: prev.suggestions.filter((_: any, i: any) => i !== index)
                                                            }));
                                                            if (newDate?.suggestions.length == 1) {
                                                                setNewDate((prev: any) => ({
                                                                    ...prev,
                                                                    observation: ''
                                                                }));
                                                            }
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Remover arquivo</span>
                                                    </Button>
                                                    : <div className="w-8"></div>

                                                }
                                            </div>
                                        )
                                    })
                                    // )
                                }
                                {newDate?.observation &&
                                    <div className="mt-4 flex items-center justify-between gap-2 rounded-md p-2 text-sm">
                                        <div className="w-full flex justify-between">
                                            <div className="min-w-0 flex flex-col items-center justify-end">
                                                <p className="w-full text-emerald-400 truncate font-medium text-start">Observação:</p>
                                                <p className="w-full text-start text-emerald-400 text-xs text-muted-foreground font-medium p-2">{newDate?.observation}</p>
                                            </div>
                                        </div>
                                    </div>

                                }
                                <div className="w-full pt-4 flex justify-between items-start">
                                    <CustomCheckbox activateWarning={activeWarningNoConfirmDate} isChecked={isCheckedDate} setIsChecked={btnCofirmDate} />

                                    {(
                                        isCheckedDate
                                        // || newDate.suggestions.length >= 3
                                    ) ? <div className="h-1"></div> : <Button onClick={handleAddDateOpen} variant="outline" size="sm" className="mt-1 w-[40%] cursor-pointer" type="button" asChild>
                                        <span>
                                            <CalendarPlus className="mr-2 h-4 w-4" />
                                            Sugerir data
                                        </span>
                                    </Button>}
                                </div>
                                <Divider />
                            </div>
                            <SubTitle message='Serviços' />
                            <div className="px-6">
                                {services.map((service, index) => (
                                    <div key={index} className="w-full flex justify-between py-1 items-center">
                                        {service.isNew
                                            ? <span onClick={() => removeServiceItem(service.randomId!)} ><Trash2 className="mr-2 h-4 w-4 text-start text-red-500 cursor-pointer" /></span>
                                            : <span><p className=" h-4" /></span>
                                        }
                                        <p className={`text-start w-full`}>{service.service}</p>
                                        <Controller
                                            control={control}
                                            name={`services.${index}.value`}
                                            render={({ field }) => (
                                                <InputValueServices
                                                    {...field}
                                                    className={`${index === 0 && highlightFirstInput ? "jump p-1 bg-slate-100 rounded-lg" : ""}`}
                                                    value={Number(field.value) || 0}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                    }}
                                                    onFocus={() => setHighlightFirstInput(false)}
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
                                    <Button onClick={handleAddServiceOpen} variant="outline" size="sm" className="w-full cursor-pointer" type="button" asChild>
                                        <span>
                                            <PackagePlus className="mr-2 h-4 w-4" />
                                            Adicionar serviços
                                        </span>
                                    </Button>
                                </div>
                                {/* } */}
                            </div>
                            <div>
                                <SubTitle message='Mídias' />
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
                                    onClick={handleOpenLastConfirmation}
                                    className="transition-all w-[60%] bg-blue-500 rounded-full active:scale-105 active:bg-blue-600 hover:bg-blue-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                                >
                                    Responder
                                </button>
                            </div>

                            {
                                (activeWarningNoConfirmDate && !isCheckedDate) &&
                                <p className="text-red-500 text-sm font-medium w-full text-center py-4">
                                    Para prosseguir é necessário confirmar a data!
                                </p>
                            }

                            <div className="flex justify-center items-center p-2">
                                <button
                                    onClick={handleConfirmDeclineOpen}
                                    className="transition-all w-[60%] bg-red-500 rounded-full active:scale-105 active:bg-red-600 hover:bg-red-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                                >
                                    Declinar
                                </button>
                            </div>
                        </div>

                    </>
                    :
                    isDecline
                        ? <ConfirmDeclineBugdget onClick={viewListBudgets} />
                        : <ConfirmationSendBugdget onClick={viewListBudgets} />
                }
            </div>
            <ModalAddDate
                isOpen={openAddDate}
                onClose={handleAddDateClose}
                saveInfo={handleDateChange}
                info={newDate}
            />
            <ModalAddService
                isOpen={openAddService}
                onClose={handleAddServiceClose}
                saveInfo={handleServiceChange}
            />
            <ModalConfirmeDecline
                isOpen={confirmDecline}
                onClose={handleConfirmDeclineClose}
                onFunction={rejectedBudget}
            />
            <ModalLastConfirmation
                isOpen={modalLastConfirmation}
                onClose={handleCancelLastConfirmation}
                onOk={handleOkLastConfirmation}
                services={services}
                total={total}
                date={
                    {
                        original: {
                            date: budget?.date_schedule,
                            period: budget?.periodo
                        },
                        suggested: newDate.suggestions
                    }
                }
            />
        </Container>
    )
}