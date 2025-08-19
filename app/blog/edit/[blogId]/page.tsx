"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { getErrorMessage } from '@/lib/utils'
import { BlogPostForm, BlogPostFormData } from "@/components/article-form"
import { Loader2 } from "lucide-react"
import type { Category } from "@/types"

export default function EditBlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          .from('posts')
          .select('*')
          .eq('slug', slug)
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

        // 获取分类数据
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true })

        if (categoryError) throw categoryError
        setCategories(categoryData as Category[])

      } catch (error) {
        toast.error("加载失败", {
          description: getErrorMessage(error),
        })
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (user && slug) fetchData()
  }, [supabase, slug, user, router])

  // 处理表单提交
  const handleSubmit = async (formData: BlogPostFormData) => {
    if (!user) {
      toast.warning("未登录", {
        description: "请先登录后再编辑文章",
      })
      router.push('/login')
      return
    }

    try {
      setIsSubmitting(true)

      // 更新文章
      const { error } = await supabase
        .from('article')
        .update({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || null,
          published: formData.published,
          is_public: formData.visibility === "public",
          categories: formData.categories,
          updated_at: new Date().toISOString()
        })
        .eq('id', formData.id)

      if (error) throw error

      toast.success("文章更新成功")
      router.push(`/posts/${slug}`)
    } catch (error) {
      toast.error("更新失败", {
        description: getErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 准备初始表单数据
  const initialFormData: BlogPostFormData = post ? {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    published: post.published,
    visibility: post.is_public ? "public" : "private",
    categories: post.categories || []
  } : undefined

  if (isLoading) {
    return (
      <div className="container mx-auto pt-20 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto pt-20 py-8">
      <Toaster position="top-right" richColors />
      <BlogPostForm
        initialData={initialFormData}
        onCancel={() => router.push(`/posts/${slug}`)}
      />
    </div>
  )
}