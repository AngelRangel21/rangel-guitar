import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface LearnCardProps {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}

export function LearnCard({ href, icon, title, description }: LearnCardProps) {
    return (
        <Link href={href} className="group block">
            <Card className="h-full transition-all duration-300 hover:border-accent hover:shadow-xl bg-card flex flex-col">
                <CardHeader>
                    {icon}
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                    <CardTitle className="text-xl font-semibold group-hover:text-accent transition-colors">
                        {title}
                    </CardTitle>
                    <CardDescription className="mt-2 flex-grow">
                        {description}
                    </CardDescription>
                    <div className="mt-4 flex items-center font-semibold text-accent">
                        <span>Ver más</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
