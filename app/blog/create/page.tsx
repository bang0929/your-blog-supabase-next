"use client"

import React from "react"

import { useRouter } from "next/navigation"
import { BlogPostForm } from "@/components/article-form"

export default function CreateBlogPost() {

    const router = useRouter()

    return (
    <div className="container mx-auto pt-20 py-8">
      <BlogPostForm
        onCancel={() => router.push('/')}
      />
    </div>
  );
}