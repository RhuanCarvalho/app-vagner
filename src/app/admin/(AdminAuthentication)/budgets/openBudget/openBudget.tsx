'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { Container } from "@/components/containers/defaultContainer";
import Modal from "@/components/modal/modal";
import { useRouter } from "next/navigation";
import { TitleHeader } from "./title/tile";
import { SubTitle } from "./title/subTitle";
import { Divider } from "../../../../../components/divider/divider";
import { formatCurrency, InputValueServices } from "./input-value-services.tsx/input-values-services";
import FileUpload, { FileWithPreview } from "@/components/addFiles/file-upload";
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

import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useBudgets } from '@/services/adminServices/budgets/budgetsServices';

dayjs.extend(customParseFormat);

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
    date_schedule: string | null;
    periodo: string | null;
    confirmed_date :{
        date: string | null,
        period: string | null
    }
};

interface BudgetCreatePageProps {
    isOpen: boolean;
    closeInX: () => void;
}

export const OpenBudget = ({ isOpen, closeInX}: BudgetCreatePageProps) => {
    const router = useRouter()
    const { 
        state: { budget, checkinData }, 
        actions: { 
            sendBudget, 
            RejectedService 
        } 
    } = useBudgets()
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
            date_schedule: null,
            periodo: null,
            confirmed_date: {
                date: '',
                period: ''
            }
        },
    });


    // Observar mudanças no formulário
    const services = watch("services");
    const additionalInfo = watch("additionalInfo");
    const date_schedule = watch("date_schedule");
    const _periodo = watch("periodo");
    const confirmed_date = watch("confirmed_date");

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
        
        formData.append("confirmed_date", JSON.stringify(confirmed_date));

        // Adicionar o campo adicional
        formData.append("additionalInfo", additionalInfo);
        formData.append("type", budget.type!);
        formData.append("id", budget.id_vehicle!);
        // formData.append("company", checkinData.company!);
        formData.append("id_estimate_service", checkinData.id_estimate_service!);

        // Adicionar os arquivos ao FormData
        files.forEach((file, index) => {
            formData.append(`files`, file.file); // `file.file` deve ser um objeto File válido
        });

        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }
        
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
            type: budget.type!,
            company: checkinData.company!,
            id_estimate_service: checkinData.id_estimate_service!,
        })
        setOk(true);
        setIsDecline(true);
    }


    const viewListBudgets = () => {
        // router.push('/budget/list/1234');
    }

    const [highlightFirstInput, setHighlightFirstInput] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setHighlightFirstInput(false), 600000);
        return () => clearTimeout(timeout);
    }, []);


    const [modalLastConfirmation, setModalLastConfirmation] = useState(false);

    const handleOpenLastConfirmation = () => {
        if (!isCheckedDate && newDate.suggestions.length == 0) {
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



    const btnCofirmDate = (checked: boolean, value: any) => {
        if (!isCheckedDate) {
            setIsCheckedDate(true);
            setValue('date_schedule', value.date)
            setValue('periodo', value.periodo)
            setValue('confirmed_date.date', dayjs(value.date, "DD/MM/YYYY").format("YYYY-MM-DD"))
            setValue('confirmed_date.period', value.periodo)
            sendGAEvent('event', `botao_para_confirmar_data`, {});
            return;
        }
        setValue('date_schedule', null)
        setValue('periodo', null)
        setValue('confirmed_date.date', null)
        setValue('confirmed_date.period', null)
        setIsCheckedDate(false);
        
    }
    
    useEffect(() => { 
        if (newDate.suggestions.length > 0) {
            setValue('date_schedule', null)
            setValue('periodo', null)
            setValue('confirmed_date.date', null)
            setValue('confirmed_date.period', null)
            setIsCheckedDate(false);
        }
    }, [newDate])

    return (
        <Modal isOpen={isOpen} onClose={closeInX}>
            <Container className='
                w-full 
                max-h-[80vh] 
                overflow-y-auto
                /* Mobile First */
                max-w-[95vw] 
                mx-auto
                /* Desktop */
                lg:max-w-4xl
                xl:max-w-5xl
                2xl:max-w-6xl
            '>
                <div className="py-4 lg:py-6">
                    {!ok
                        ?
                        <>
                            <TitleHeader title={budget?.car!} />
                            <div className="w-max px-6 pt-8">
                                <p className="bg-[#cfb400] text-white shadow-lg font-medium text-lg px-8 py-1 rounded-lg">Expira em {budget?.approval_expires_at}</p>
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
                                    {budget.options_dates.map(opDates => (
                                        <div key={`${opDates.date}${opDates.periodo}`} className={`
                                            w-full flex justify-between py-1 pr-2 my-1 items-center  
                                            ${((newDate.suggestions.length > 0) || (date_schedule != null && (date_schedule != dayjs(opDates.date).format("DD/MM/YYYY") || _periodo != opDates.periodo))) && " bg-red-50 rounded-lg "}
                                            ${(isCheckedDate && (date_schedule == dayjs(opDates.date).format("DD/MM/YYYY") &&  _periodo == opDates.periodo)) && "text-emerald-400 bg-emerald-50 rounded-lg"}
                                            `}>
                                            {
                                                (newDate.suggestions.length > 0 || (isCheckedDate && (date_schedule != dayjs(opDates.date).format("DD/MM/YYYY") || _periodo != opDates.periodo)))
                                                    ?
                                                    <div></div>
                                                    :
                                                    <CustomCheckbox
                                                        disabledComment={true}
                                                        valueChecked={{ date: dayjs(opDates.date).format("DD/MM/YYYY"), periodo: opDates.periodo }}
                                                        activateWarning={activeWarningNoConfirmDate}
                                                        isChecked={date_schedule == dayjs(opDates.date).format("DD/MM/YYYY") && _periodo == opDates.periodo}
                                                        setIsChecked={btnCofirmDate}
                                                    />
                                            }
                                            {/* <p className={`${(newDate.suggestions.length > 0) ? "line-through" : isCheckedDate ? "text-emerald-400 font-semibold" : ""}`}>{dayjs(opDates.date).format("DD/MM/YYYY")}, período da {opDates.periodo}</p> */}
                                            <div className={`
                                                w-max flex flex-col items-center justify-end 
                                                ${(newDate.suggestions.length > 0 || (isCheckedDate && (date_schedule != dayjs(opDates.date).format("DD/MM/YYYY")||  _periodo != opDates.periodo) )) ? "line-through" : (isCheckedDate && (date_schedule == dayjs(opDates.date).format("DD/MM/YYYY") &&  _periodo == opDates.periodo)) ? "text-emerald-400 font-semibold bg-emerald-50 rounded-lg" : ""}`}>
                                                <p className="w-full text-end truncate font-medium">{dayjs(opDates.date).format("DD/MM/YYYY")}</p>
                                                <p className="text-end text-[13px] text-muted-foreground font-medium">período da {opDates.periodo}</p>
                                            </div>
                                        </div>

                                    ))

                                    }
                                    {/* <div className="w-full flex justify-between py-1 items-center">
                                        <p>Data</p>
                                        <p className={`${(newDate.suggestions.length > 0) ? "line-through" : isCheckedDate ? "text-emerald-400 font-semibold" : ""}`}>{dayjs(budget?.date_schedule).format("DD/MM/YYYY")}, período da {budget?.periodo}</p>
                                    </div> */}
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
                                        {/* {
                                        (newDate.suggestions.length == 0) 
                                        // ? <CustomCheckbox activateWarning={activeWarningNoConfirmDate} isChecked={isCheckedDate} setIsChecked={btnCofirmDate} />
                                        && 
                                    } */}
                                        <div></div>
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
                                                        className={`w-[102px] ${index === 0 && highlightFirstInput ? "jump p-1 bg-slate-100 rounded-lg" : ""}`}
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
                                    (activeWarningNoConfirmDate && !isCheckedDate && newDate.suggestions.length == 0) &&
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
                            : null
                            // <ConfirmationSendBugdget onClick={viewListBudgets} />
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
                                date: date_schedule,
                                period: _periodo
                            },
                            suggested: newDate.suggestions
                        }
                    }
                />
            </Container>
        </Modal>
    )
}