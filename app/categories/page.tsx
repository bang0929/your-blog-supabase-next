import { createClient } from '@/lib/supabase/server';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Link from "next/link";


export default async function Categories() {
    const supabase = await createClient();

    const {data, error} = await supabase
        .from('categories')
        .select(`
            id,
            name,
            article_categories (article_id)
        `);
    // console.log(data, error);
    // 处理错误或空数据情况
    if (error) {
        console.error("Error fetching categories:", error.message);
        return <div></div>;
    }

    if (!data || data.length === 0) {
        return <div className="pt-20 flex justify-center">暂无数据</div>;
    }

    const countData = data.map(category => ({
        id: category.id,
        name: category.name,
        article_count: category.article_categories?.length || 0
    }));
    // 按照 article_count 从大到小排序
    const sortedData = countData.sort((a, b) => b.article_count - a.article_count);

    return (
        <div className="container mx-auto px-4 md:px-24 pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                sortedData.map(item => {
                    return (
                        <Link key={item.id} href={`/categories/${item.id}`}>
                            <Card key={item.id} className=" cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardDescription>共 {item.article_count} 篇文章</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>

                    )
                })
            }
        </div>
    )
}