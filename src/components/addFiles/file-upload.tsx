'use client'
import { sendGAEvent } from '@next/third-parties/google'

import type React from "react"

import { useEffect, useState } from "react"
import { FileUp, File, ImageIcon, Music, Video, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"

export type FileWithPreview = {
  file: File
  id: string
  preview?: string
}

interface FileUploadProps {
  handleFiles: (files: any[]) => void;
}

export default function FileUpload({ handleFiles }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [previewFile, setPreviewFile] = useState<FileWithPreview | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files).map((file) => {
      // Create a unique ID for each file
      const id = uuidv4()

      // Create preview URL for images, videos, and audio
      let preview
      if (
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type.startsWith("audio/") ||
        file.type === "application/pdf"
      ) {
        preview = URL.createObjectURL(file)
      }

      return { file, id, preview }
    })

    setFiles((prev) => [...prev, ...newFiles])
    sendGAEvent('event', `add_arquivo`, {});


    // Reset the input value so the same file can be selected again
    e.target.value = ""
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((file) => file.id !== id)

      // Revoke object URLs to avoid memory leaks
      const removedFile = prev.find((file) => file.id === id)
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview)
      }

      // If the removed file is currently being previewed, close the preview
      if (previewFile?.id === id) {
        setPreviewFile(null)
      }
      sendGAEvent('event', `removeu_arquivo`, {});
      return filtered
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (fileType.startsWith("audio/")) return <Music className="h-4 w-4" />
    if (fileType === "application/pdf") return <File className="h-4 w-4" />
    if (fileType.startsWith("video/")) return <Video className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const handleFileClick = (fileData: FileWithPreview) => {
    setPreviewFile(fileData)
  }

  useEffect(()=>{
    handleFiles(files);
  }, [files])

  const renderPreview = () => {
    if (!previewFile || !previewFile.preview) return null

    const { file, preview } = previewFile

    if (file.type.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center">
          <Image
            src={preview || "/placeholder.svg"}
            alt={file.name}
            width={500}
            height={300}
            className="max-h-[70vh] w-auto object-contain"
          />
        </div>
      )
    }

    if (file.type.startsWith("video/")) {
      return (
        <video src={preview} controls className="max-h-[70vh] w-full" autoPlay>
          Seu navegador não suporta a reprodução de vídeos.
        </video>
      )
    }

    if (file.type.startsWith("audio/")) {
      return (
        <div className="flex flex-col items-center gap-4 p-4">
          <Music className="h-16 w-16 text-primary" />
          <p className="text-center font-medium">{file.name}</p>
          <audio src={preview} controls className="w-full">
            Seu navegador não suporta a reprodução de áudios.
          </audio>
        </div>
      )
    }

    if (file.type === "application/pdf") {
      return (
        <iframe src={preview} className="h-[70vh] w-full" title={file.name}>
          Seu navegador não suporta a visualização de PDFs.
        </iframe>
      )
    }

    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <File className="h-16 w-16 text-primary" />
        <p className="text-center font-medium">{file.name}</p>
        <p className="text-center text-sm text-muted-foreground">
          Este tipo de arquivo não pode ser visualizado diretamente.
        </p>
        <Button asChild>
          <a href={preview} download={file.name}>
            <Download className="mr-2 h-4 w-4" />
            Baixar arquivo
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-3">
        <input
          type="file"
          id="file-upload"
          className="sr-only"
          onChange={handleFileChange}
          multiple
          // accept="image/*,application/pdf,audio/*,video/*"
          accept="image/*,audio/*,video/*"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" size="sm" className="w-full cursor-pointer" type="button" asChild>
            <span>
              <FileUp className="mr-2 h-4 w-4" />
              Adicionar arquivos
            </span>
          </Button>
        </label>
        {/* <p className="mt-1 text-xs text-muted-foreground">PDF, imagens, áudios e vídeos são suportados</p> */}
        <p className="mt-1 text-xs text-muted-foreground">Imagens, áudios e vídeos são suportados</p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((fileData) => (
            <li key={fileData.id} className="flex items-center gap-2 rounded-md border p-2 text-sm">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md bg-muted"
                onClick={() => fileData.preview && handleFileClick(fileData)}
              >
                {getFileIcon(fileData.file.type)}
              </div>

              <div
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => fileData.preview && handleFileClick(fileData)}
              >
                <p className="truncate font-medium">{fileData.file.name}</p>
                <p className="text-xs text-muted-foreground">{(fileData.file.size / 1024).toFixed(0)} KB</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(fileData.id)
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remover arquivo</span>
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={previewFile !== null} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="bg-white sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="truncate pr-10">{previewFile?.file.name}</DialogTitle>
          </DialogHeader>
          {renderPreview()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

