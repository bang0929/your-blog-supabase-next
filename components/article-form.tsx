// components/blog-post-form.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RichTextEditor } from "@/components/rich-text-editor"
import type { Category } from "@/types"
import { Loader2 } from "lucide-react"

import {getErrorMessage} from '@/lib/utils'
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Toaster, toast } from "sonner"
import { useRouter } from "next/navigation"

export interface BlogPostFormData {
  id?: number | string
  slug: string
  title: string
  excerpt: string
  content: string
  published: boolean
  visibility: "private" | "public"
  categories: number[]
}

interface BlogPostFormProps {
  initialData?: BlogPostFormData
  onCancel: () => void
}

export function BlogPostForm({
  initialData,
  onCancel,
}: BlogPostFormProps) {
  // 表单状态
  const [title, setTitle] = useState(initialData?.title || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [published, setPublished] = useState(true)
  const [visibility, setVisibility] = useState<"private" | "public">(
    initialData?.visibility || "private"
  )
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialData?.categories || []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // 当初始数据变化时更新表单（用于编辑模式）
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setExcerpt(initialData.excerpt)
      setContent(initialData.content)
      // setPublished(initialData.published)
      setVisibility(initialData.visibility)
      setSelectedCategories(initialData.categories)
    }

    // 获取分类数据
    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })
            if (error) {
                throw error
            }
            console.log("Fetched categories:", data)
            setCategories(data as Category[])

        } catch (error) {
            toast.warning("加载分类失败", {
                description: getErrorMessage(error),
            })

        } finally {
            setLoadingCategories(false)
        }
    }
    fetchCategories()
  }, [supabase, initialData])

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
        toast.warning("未登录", {
            description: "请先登录后再创建文章",
        })
        router.push('/login')
        return
    }

    if(!title.trim() || !content.trim()) {
      toast.warning("表单不完整", {
        description: "请填写标题和内容",
      })
      return
    }


    try {
      setIsSubmitting(true)

      if(initialData) {
        // 编辑文章
        // console.log('编辑文章', initialData.id, {
        //   title: title,
        //   content: content,
        //   excerpt: excerpt || null,
        //   author_id: user.id,
        //   published: published,
        //   is_public: visibility === "public",
        //   categories: selectedCategories,
        //   updated_at: new Date().toISOString()
        // });
        // 更新文章
        const { error } = await supabase
          .from('article')
          .update({
            title: title,
            content: content,
            excerpt: excerpt || null,
            published: published,
            is_public: visibility === "public",
            categories: selectedCategories,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id)

        if (error) throw error

        // 文章-分类关系表, 清除旧数据
        const articleId = initialData.id
        const { error: DelRelationError  } = await supabase
          .from('article_categories')
          .delete()
          .eq('article_id', articleId); // 从前端获取参数
        if (DelRelationError) {
            throw DelRelationError
        }

        // 文章-分类关系表, 插入新数据
        if (selectedCategories.length > 0) {
          const categoryRelations = selectedCategories.map((categoryId) => ({
            article_id: articleId,
            category_id: categoryId,
          }))

          const { error: relationError } = await supabase.from("article_categories").insert(categoryRelations)
          if (relationError) {
            throw relationError
          }
        }
        toast.success("文章更新成功")
        router.push(`/blog/${initialData.slug}`)

      } else {

        // 生成唯一的slug
        const slug =
          title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "") +
          "-" +
          Date.now().toString().slice(-6)

        const {data, error} = await supabase
          .from("article")
          .insert([
            {
              title: title,
              content: content,
              excerpt: excerpt || null,
              author_id: user.id,
              author: {
                username: user.user_metadata.user_name,
                avatar_url: user.user_metadata.avatar_url,
                email: user.user_metadata.email,
                provider: user.app_metadata.provider,
              },
              published: published,
              slug,
              is_public: visibility === "public",
              categories: selectedCategories
            }
          ])
          .select()
        if(error) {
          throw error
        }

        // 文章-分类关系表 插入新数据
        const articleId = data[0].id
        if (selectedCategories.length > 0) {
          const categoryRelations = selectedCategories.map((categoryId) => ({
            article_id: articleId,
            category_id: categoryId,
          }))

          await supabase.from("article_categories").insert(categoryRelations)
          // if (relationError) {
          //   throw relationError
          // }
        }
        console.log('文章创建成功', data);

        toast.success("文章创建成功", {
          description: published ? "您的文章已发布" : "您的文章已保存为草稿",
        })
        // 重定向到新创建的文章页面或仪表板
        if (published) {
          router.push(`/blog/${data[0].slug}`)
        } else {
          router.push("/")
        }
      }


    } catch (error) {
      toast.warning(initialData ? "更新失败" :  "创建失败", {
        description: getErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理分类选择
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  return (
    <Card className="mx-auto">
      <Toaster position="top-right" richColors  />
      <CardHeader>
        <CardTitle>{initialData ? "编辑文章" : "创建新文章"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入文章标题"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">摘要 (可选)</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="输入文章摘要..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容 *</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="开始编写文章内容..."
              disabled={isSubmitting}
              immediatelyRender={false}
            />
          </div>

          <div className="space-y-2">
            <Label>分类</Label>
            {loadingCategories ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                加载分类中...
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">暂无分类</p>
            )}
          </div>

          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={checked => setPublished(checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="published">立即发布</Label>
          </div> */}

          <div className="space-y-2">
            <Label>可见性</Label>
            <RadioGroup
              value={visibility}
              onValueChange={value => setVisibility(value as "private" | "public")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">私有 - 仅登录用户可见</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">公开 - 所有人可见</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {
            initialData &&
            <Button className="mr-8" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              取消
            </Button>
          }
          {
            initialData ?
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存更改"}
            </Button>
            :
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : published ? "发布文章" : "保存为草稿"}
            </Button>
            }
        </CardFooter>
      </form>
    </Card>
  )
}