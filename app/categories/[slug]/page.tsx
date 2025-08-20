import BlogListCard from '@/components/blog-list-card';
import { createClient } from '@/lib/supabase/server';
import type { Post, Category } from "@/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

async function getCategoryBySlug(slug: string | number) {
  const supabase =  await createClient()

  const { data, error } = await supabase.from("categories").select("*").eq("id", slug).single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data as Category
}

async function getArticlesByCategory(categoryId: string | number) {
  const supabase = await createClient()
  const { data: list, error: listError } = await supabase
        .from('article')
        .select('*')
        .contains('categories', [categoryId])  // 注意：这里假设categories数组中的元素是字符串
        .order('created_at', { ascending: false });
  console.log(list, listError);
  // 处理错误或空数据情况
  if (listError) {
      // console.error("Error fetching categories:", error.message);
      return [];
  }

  // 获取作者信息
  // const authorIds = [...new Set(list.map((post) => post.author_id))]
  // const { data: profiles, error: profilesError } = await supabase.from("user_profiles").select("*").in("id", authorIds)

  // if (profilesError) {
  //   console.error("Error fetching user profiles:", profilesError)
  //   return list as Post[]
  // }

  // // 合并文章和作者信息
  // const postsWithAuthors = list.map((post) => {
  //   const author = profiles?.find((profile) => profile.id === post.author_id)
  //   return {
  //     ...post,
  //     author: author || null,
  //   }
  // })

  return list as Post[]
}

export default async function CategoriesBlogList({
  params
}: {
  params: Promise<{ slug: number | string }>
}) {
    const slug = (await params).slug;
    console.log(slug);
    const category = await getCategoryBySlug(slug)

    if (!category) {
      notFound()
    }
    const articles = await getArticlesByCategory(slug)

    return (
      <div className='pt-24 pb-20'>
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
          {/* {category.description && <p className="text-muted-foreground">{category.description}</p>} */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {
            articles.length > 0 ? articles.map(item => {
              return (
                <BlogListCard key={item.id} item={item}></BlogListCard>
              )
            }) :
            (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">该分类下暂无公开文章</p>
                <Link href="/blog/create">
                  <Button>创建文章</Button>
                </Link>
              </div>
            )

          }

        </div>
      </div>

    )
}