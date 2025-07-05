'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AdminRequestsContent } from "@/components/admin-requests-content";
import { ProtectedPage } from "@/components/protected-page";

export default function AdminRequestsPage() {
    return (
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <AdminRequestsContent />
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
