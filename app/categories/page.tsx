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

    const {data, error} = await supabase.from('categories').select('*');
    console.log(data, error);
    // 处理错误或空数据情况
    if (error) {
        console.error("Error fetching categories:", error.message);
        return <div></div>;
    }

    if (!data || data.length === 0) {
        return <div className="pt-20 flex justify-center">暂无数据</div>;
    }

    return (
        <div className="pt-20 flex flex-wrap">
            {
                data.map(item => {
                    return (
                        <Link key={item.id} href={`/categories/${item.id}`}>
                            <Card key={item.id} className="w-64 m-4 cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardDescription>{item.article_count}</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>

                    )
                })
            }
        </div>
    )
}