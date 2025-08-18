"use client"

import React, { use } from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import type { Category } from "@/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import {getErrorMessage} from '@/lib/utils'

export default function CreateBlogPost() {
    const [title, setTitle] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [content, setContent] = useState('')
    const [published, setPublished] = useState(false)
    const [visibility, setVisibility] = useState<"private" | "public">("private")
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [isLoading, setIsLoading] = useState(false)


    const { user } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const supabase = createClient()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })
                if (error) {
                    throw error
                }
                console.log("Fetched categories:", data)
                setCategories(data as Category[])

            } catch (error) {
                toast({
                    title: "加载分类失败",
                    description: getErrorMessage(error),
                    variant: "destructive",
                })

            } finally {

                setLoadingCategories(false)
            }
        }
        fetchCategories()
    }, [supabase, toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log("Current user in create blog", user);
        if (!user) {
            toast({
                title: "未登录",
                description: "请先登录后再创建文章",
                variant: "destructive",
            })
            router.push('/login')
            return
        }

    }

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prev) => {
            if(prev.includes(categoryId)) {
                return prev.filter((id) => id !== categoryId)
            } else {
                return [...prev, categoryId]
            }
        })
    }
    return (
    <div className="container mx-auto pt-20 py-8">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>创建新文章</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文章标题"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">摘要 (可选)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="输入文章摘要..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="开始编写文章内容..."
                disabled={isLoading}
                immediatelyRender={false}
              />
            </div>

            <div className="space-y-2">
              <Label>分类</Label>
              {loadingCategories ? (
                <p className="text-sm text-muted-foreground">加载分类中...</p>
              ) : categories.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                        disabled={isLoading}
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={published}
                onCheckedChange={(checked) => setPublished(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="published">立即发布</Label>
            </div>

            <div className="space-y-2">
              <Label>可见性</Label>
              <RadioGroup value={visibility} onValueChange={(value) => setVisibility(value as "private" | "public")}>
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
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline" disabled={isLoading}>
                取消
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : published ? "发布文章" : "保存为草稿"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}