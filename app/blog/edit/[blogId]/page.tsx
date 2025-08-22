"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { getErrorMessage } from '@/lib/utils'
import { BlogPostForm, BlogPostFormData } from "@/components/article-form"
import { Loader2 } from "lucide-react"

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditBlogPost() {
  const { blogId } = useParams()
  console.log(useParams());

  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // 获取文章数据和分类数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // 获取文章数据
        const { data: postData, error: postError } = await supabase
          .from('article')
          .select('*')
          .eq('id', blogId)
          .single()

        if (postError) throw postError
        if (!postData) {
          toast.error("文章不存在")
          router.push('/')
          return
        }

        // 检查当前用户是否有权限编辑
        if (postData.author_id !== user?.id) {
          toast.error("没有编辑权限")
          router.push('/')
          return
        }

        setPost(postData)

      } catch (error) {
        toast.error("加载失败", {
          description: getErrorMessage(error),
        })
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (user && blogId) fetchData()
  }, [])

  const initialFormData: BlogPostFormData = post ? {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    slug: post.slug,
    published: post.published,
    visibility: post.is_public ? "public" : "private",
    categories: post.categories || []
  } : undefined

  if (isLoading) {
    return (
      <div className="container px-4 md:px-48 mx-auto pt-20 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-48 mx-auto pt-20 py-8">
        {/* <Button type="ghost"> */}
            <Link href={`/blog/${initialFormData.slug}`}
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
            </Link>
        {/* </Button> */}

        <BlogPostForm
            initialData={initialFormData}
            onCancel={() => router.back()}
        />
    </div>
  )
}