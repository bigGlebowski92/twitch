import { Header } from '@/components/layout/header/Header'

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex-1">
                <div className="fixed inset-y-0 z-50 h-[75px] h-full"></div>
                <Header />
            </div>

            <main className="mt-[75px]">{children}</main>
        </div>
    )
}
