"use client"

import React from "react"

import { useRouter } from "next/navigation"
import { BlogPostForm } from "@/components/article-form"

export default function CreateBlogPost() {

    const router = useRouter()

    return (
    <div className="container px-4 md:px-48 mx-auto pt-20 py-8">
      <BlogPostForm
        onCancel={() => router.back()}
      />
    </div>
  );
}