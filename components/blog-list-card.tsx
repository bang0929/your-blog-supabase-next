'use client';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function CategoriesCard({item}: { item: { id: number; name: string; article_count: number } }) {
    return (
        <Card className="w-64 m-4 cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.article_count}</CardDescription>
            </CardHeader>
        </Card>
    )
}