"use client"

import { Container } from "@/components/containers/defaultContainer";
import { HeaderTemplate } from "@/components/header/header";
import { useParams, useRouter } from "next/navigation";
import { TitleHeader } from "./title/tile";
import { users } from "@/fakeData/fakeData";
import { SubTitle } from "./title/subTitle";
import { Divider } from "../../../components/divider/divider";
import { InputValueServices } from "./input-value-services.tsx/input-values-services";
import FileUpload from "@/components/addFiles/file-upload";
import { useCheckin } from "@/services/checkin";
import MediaGallery from "@/components/galleryMedias";

const mediaItems = [
    {
      id: "1",
      type: "image" as const,
      url: "/mediasexemplos/img1.jpg",
      title: "Image 1",
    },
    {
        id: "2",
        type: "image" as const,
        url: "/mediasexemplos/img2.jpg",
        title: "Image 2",
    },
    {
        id: "3",
        type: "video" as const,
        url: "/mediasexemplos/ex-video1.mp4",
        title: "Video",
    },
    {
        id: "4",
        type: "audio" as const,
        url: "/mediasexemplos/ex-audio2.mp3",
        title: "Image 2",
    },
    {
        id: "5",
        type: "pdf" as const,
        url: "/mediasexemplos/exemplo-document.pdf",
        title: "PDF Document",
    },
    {
        id: "6",
        type: "other" as const,
        url: "https://example.com/sample-file.zip",
        title: "Sample File",
    },
    {
        id: "7",
        type: "image" as const,
        url: "/mediasexemplos/img3.jpg",
        title: "Image 3",
    },
    {
        id: "8",
        type: "image" as const,
        url: "/mediasexemplos/img4.jpg",
        title: "Image 4",
    },
    {
        id: "9",
        type: "image" as const,
        url: "/mediasexemplos/img5.jpg",
        title: "Image 5",
    },
  ]


interface BudgetCreatePageProps {
}

export default function BudgetCreatePage({ }: BudgetCreatePageProps) {
    const router = useRouter()
    const { state: { budget } } = useCheckin()

    const handleResponseClick = () => {
        // router.push('/budget/list')
        alert("Em breve!")
    }

    return (
        <Container>
            <div>
                <HeaderTemplate />
                <TitleHeader title={budget?.car!} />
                <div className="w-max px-6 pt-8">
                    <p className="bg-blue-500 text-white shadow-lg font-medium text-lg px-8 py-1 rounded-lg">Expira em {budget?.approval_expires_at}</p>
                </div>
                <div >
                    <SubTitle message='Medias' />
                    <div className="px-6">
                        <MediaGallery items={mediaItems} />
                    </div>
                </div>
                <div>
                    <SubTitle message='Sobre o agendamento' />
                    <div className="px-6">
                        <div className="w-full flex justify-between py-1 items-center">
                            <p className="text-start max-w-[32%]">{budget?.car}</p>
                            <p>-</p>
                            <p className="min-w-max">{budget?.km} KM</p>
                            <p>-</p>
                            <p className="min-w-max">{budget?.genero} {budget?.idade} anos</p>
                        </div>
                        <Divider />
                        <div className="w-full flex justify-between py-1 items-center">
                            <p>Data</p>
                            <p>{budget?.date_schedule}, período da {budget?.periodo}</p>
                        </div>
                        <Divider />
                    </div>
                    <SubTitle message='Serviços' />
                    <div className="px-6">
                        {budget?.services.map((service, id) => (
                            <div key={id} className="w-full flex justify-between py-1 items-center">
                                <p>{service.service}</p>
                                <InputValueServices value={Number(service.value)} />
                            </div>

                        ))}
                    </div>
                    <SubTitle message='Arquivos Adicionais' />
                    <div className="w-full flex justify-center px-6">
                        <FileUpload />
                    </div>

                    <SubTitle message='Informações adicionais' />
                    <div className="px-6">
                        <textarea
                            className="w-full border-slate-300 border-1 rounded-lg h-32 p-2 shadow-lg resize-none"
                            placeholder="Digite aqui..."
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
                </div>
            </div>
        </Container>
    )
}