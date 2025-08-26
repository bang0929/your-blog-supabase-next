'use client';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

import { formatDate } from "@/lib/utils"
import type { Post, Category } from "@/types"
import Link from "next/link"
interface BlogPostCardProps {
  item: Post,
  allCategories: Category[]
}

export default function CategoriesCard({item, allCategories}: BlogPostCardProps) {
    return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>发布：{formatDate(item.created_at)}</span>
                    <span>更新：{formatDate(item.updated_at)}</span>
                </div>
                <Link href={`/blog/${item.slug}`} className="hover:underline">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                </Link>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{item.excerpt || item.content.substring(0, 150) + "..."}</p>
            </CardContent>
            <CardFooter>
                <div className='flex flex-wrap gap-2'>
                    {articleCategoryNames(item.categories, allCategories)}
                </div>
            </CardFooter>
        </Card>
    )
}

function articleCategoryNames(categories: any, allCategories: Category[]) {
    if (!categories || categories.length === 0) {
        return "未分类"
    }
    const categoryNames = categories.map((ac: number) => {
        const category = allCategories.find(cat => cat.id === ac)
        // console.log(category);
        return <Badge key={ac} variant="secondary">{category?.name}</Badge>
    })
    return categoryNames
}
