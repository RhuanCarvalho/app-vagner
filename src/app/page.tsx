"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage(){
    const router = useRouter()
    useEffect(() => {
        const IS_DEV = process.env.NEXT_PUBLIC_IS_DEV === 'true';
        const path_router = IS_DEV ? '/checkin?company=2&id=49&type=estimate&id_estimate_service=134': '/checkin';
        router.push(path_router);
    }, [])
    return <></>
}

  