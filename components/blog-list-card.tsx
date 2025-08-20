'use client';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import { Button } from "@/components/ui/button"

import { formatDate } from "@/lib/utils"
import type { Post } from "@/types"
import Link from "next/link"
interface BlogPostCardProps {
  item: Post
}

export default function CategoriesCard({item}: BlogPostCardProps) {
    return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="text-sm text-muted-foreground mb-1">
                    {formatDate(item.created_at)} · 作者
                </div>
                <Link href={`/blog/${item.slug}`} className="hover:underline">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                </Link>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground">{item.excerpt || item.content.substring(0, 150) + "..."}</p>
            </CardContent>
            {/* <CardFooter>
                <Link href={`/blog/${item.slug}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        阅读全文
                    </Button>
                </Link>
            </CardFooter> */}
        </Card>
    )
}