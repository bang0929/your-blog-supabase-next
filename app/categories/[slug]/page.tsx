import BlogListCard from '@/components/blog-list-card';
import { createClient } from '@/lib/supabase/server';

export default async function CategoriesBlogList({
  params
}: {
  params: Promise<{ slug: number | string }>
}) {
    const slug = (await params).slug;
    console.log(slug);
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('article')
        .select('*')
        .eq('categorie_id', slug);
    console.log(data, error);
    return (
        <div className="pt-20 flex flex-wrap">
            {/* <BlogListCard></BlogListCard> */}
        </div>
    )
}