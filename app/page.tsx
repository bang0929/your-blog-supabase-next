import { createClient } from '@/lib/supabase/server';
import type { Post, Category } from "@/types"

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BlogListCard from '@/components/blog-list-card';
import Link from "next/link"
import ArticleListClient from '@/components/article-list-client';

// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,

//  } from "@/components/ui/select";

async function getArticlesByCategory() {
  const supabase = await createClient()
  const { data: list, error: listError } = await supabase
        .from('article')
        .select('*')  // 注意：这里假设categories数组中的元素是字符串
        .order('created_at', { ascending: false });
  // console.log(list, listError);
  // 处理错误或空数据情况
  if (listError) {
      // console.error("Error fetching categories:", error.message);
      return [];
  }
  return list as Post[]
}

async function getAllCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").order('id', { ascending: true })
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data as Category[]
}

export default async function Home() {
  const articles = await getArticlesByCategory()
  let allCategories = [] as Category[]
  if(articles.length) {
    allCategories = await getAllCategories()
  }

  return (
    <div className="container px-4 md:px-24 pt-20 md:pt-24 font-sans min-h-screen gap-16">
      <ArticleListClient
        initialArticles={articles}
        allCategories={allCategories}
      />
    </div>
  );
}
