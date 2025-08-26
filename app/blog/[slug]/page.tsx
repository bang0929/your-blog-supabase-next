"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client"
import { formatDate, getErrorMessage } from "@/lib/utils"
// import DOMPurify from "dompurify";
import { RichTextRenderer } from "@/components/rich-text-renderer";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider"
import {Post} from '@/types';
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function BlogDetail() {
    const { slug } = useParams();
    const [article, setArticle] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()
    const {user} = useAuth()
    // 使用useMemo缓存supabase客户端，避免重复创建
    const supabase = useMemo(() => createClient(), []);
    // 使用ref跟踪当前请求，避免重复请求
    const currentRequestSlug = useRef<string | null>(null);

    useEffect(() => {
      // 如果没有slug或者slug与当前请求相同，则不执行
      console.log(currentRequestSlug.current, slug, currentRequestSlug.current === slug);

      if (!slug || currentRequestSlug.current === slug) return;

      currentRequestSlug.current = slug as string;

      const fetchArticle = async () => {
        try {
          setLoading(true);
          setError(null);

          // 获取文章数据
          const { data: articleData, error: articleError } = await supabase
            .from("article")
            .select("*")
            .eq("slug", slug)
            .eq("published", true)
            .single();

            if (articleError) throw articleError;
            if (!articleData) {
              setError("文章不存在");
              // 请求失败，重置currentRequestSlug以允许重试
              currentRequestSlug.current = null;
              return;
            }
            console.log(articleData);

            setArticle(articleData);

        } catch (error) {
          console.error("Error fetching article:", error);
          setError(getErrorMessage(error) || "加载文章失败");
          // 请求失败，重置currentRequestSlug以允许重试
          currentRequestSlug.current = null;
        } finally {
          setLoading(false);
        }
      }
      if (slug) {
        console.log('博客详情',slug);
        fetchArticle();
      }
    },[slug, supabase, router])

    if (loading) {
      return (
        <div className="container px-4 md:px-48 mx-auto pt-20 h-screen">
          <article className="mx-auto bg-white p-8 min-h-full mt-2">
            <div className="mb-8">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </article>
        </div>
      );
    }


    if (error || !article) {
      return (
        <div className="container px-4 md:px-48 mx-auto pt-20 h-screen">
          <article className="mx-auto bg-white p-8 min-h-full mt-2">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-red-600 mb-4">加载失败</h2>
              <p className="text-gray-600 mb-6">{error || "文章不存在"}</p>
              <Button asChild>
                <Link href="/">返回首页</Link>
              </Button>
            </div>
          </article>
        </div>
      );
    }

    // 安全地清理和渲染HTML内容
    // const cleanHtml = DOMPurify.sanitize(article.content);

    return (
        <div className="container mx-auto px-4 md:px-24 pt-24 pb-12">
            <Breadcrumb className='mb-4'>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/categories">分类</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>博客详情</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <article className="mx-auto bg-white p-8 pt-12 min-h-full mt-2 relative">
              {article.author_id === user?.id}<div className="absolute top-2 right-4">
                <Button className="">
                  <Link href={`/blog/edit/${article.slug}`}>编辑</Link>
                </Button>
              </div>
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <div className="text-muted-foreground">
                  <span>发布于：{formatDate(article.created_at)}</span>
                  <span className="mr-2 ml-2">·</span>
                  <span>作者：{article.author?.username}</span>
                  <span className="mr-2 ml-2">·</span>
                  <span>更新于：{formatDate(article.updated_at)}</span>
                  {!article.is_public && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      私有文章
                    </span>
                  )}
                </div>
              </header>
              <RichTextRenderer content={article.content}/>
            </article>
        </div>
    )
}