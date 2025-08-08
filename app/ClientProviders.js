"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

export default function ClientProviders({ children }) {
    return (
        <ClerkProvider>
            <Toaster />
            {children}
        </ClerkProvider>
    );
}
