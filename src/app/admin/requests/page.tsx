import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSongRequests } from "@/services/requests-service";
import { AdminRequestsContent } from "@/components/admin-requests-content";

export default async function AdminRequestsPage() {
    const requests = await getSongRequests();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <AdminRequestsContent requests={requests} />
            </main>
            <Footer />
        </div>
    );
}
