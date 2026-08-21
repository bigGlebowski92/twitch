import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface AuthWrapperProps {
    heading: string
    backButtonLabel?: string
    backButtonHref?: string
}

export function AuthWrapper({
    children,
    heading,
    backButtonLabel,
    backButtonHref,
}: PropsWithChildren<AuthWrapperProps>) {
    return (
        <div className="flex h-full min-h-svh items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader>
                    <Image
                        src="/images/logo.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                    <CardTitle>{heading}</CardTitle>
                </CardHeader>
                <CardContent>{children}</CardContent>
                <CardFooter className="-mt-2">
                    {backButtonLabel && backButtonHref && (
                        <Link
                            href={backButtonHref}
                            className="text-muted-foreground text-sm"
                        >
                            {backButtonLabel}
                        </Link>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
