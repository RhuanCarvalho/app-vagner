import { ProviderAuthCheckin } from "@/components/auth/auth";

export default function OnlyAuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProviderAuthCheckin>
            {children}
        </ProviderAuthCheckin>
    );
}
