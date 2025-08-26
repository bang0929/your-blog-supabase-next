"use client";

import { useState, useMemo } from "react";
import type { Post, Category } from "@/types"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BlogListCard from '@/components/blog-list-card';
import Link from "next/link"

// 排序类型
type SortType = "latest" | "oldest" | "recently-modified";

interface ArticleListClientProps {
  initialArticles: Post[];
  allCategories: Category[];
}

export default function ArticleListClient({
  initialArticles,
  allCategories
}: ArticleListClientProps) {
  const [articles] = useState<Post[]>(initialArticles);
  const [sortType, setSortType] = useState<SortType>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 每页显示9篇文章

  // 排序函数
  const sortArticles = (articles: Post[], type: SortType): Post[] => {
    const sortedArticles = [...articles];

    switch (type) {
      case "latest":
        return sortedArticles.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return sortedArticles.sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "recently-modified":
        return sortedArticles.sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      default:
        return sortedArticles;
    }
  };

  // 获取排序后的文章
  const sortedArticles = useMemo(() => {
    return sortArticles(articles, sortType);
  }, [articles, sortType]);

  // 分页逻辑
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedArticles, currentPage, itemsPerPage]);

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 生成页码按钮
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 上一页按钮
    if (currentPage > 1) {
      pages.push(
        <Button
          key="prev"
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          className="mx-1"
        >
          上一页
        </Button>
      );
    }

    // 第一页和省略号
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          onClick={() => handlePageChange(1)}
          className="mx-1"
        >
          1
        </Button>
      );

      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 py-2">
            ...
          </span>
        );
      }
    }

    // 页码按钮
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => handlePageChange(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    // 最后一页和省略号
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 py-2">
            ...
          </span>
        );
      }

      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          onClick={() => handlePageChange(totalPages)}
          className="mx-1"
        >
          {totalPages}
        </Button>
      );
    }

    // 下一页按钮
    if (currentPage < totalPages) {
      pages.push(
        <Button
          key="next"
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          className="mx-1"
        >
          下一页
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-[32px] row-start-2 sm:items-start">
      {/* 排序控件 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Label className="whitespace-nowrap">排序方式：</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortType === "latest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortType("latest")}
          >
            最新发布
          </Button>
          <Button
            variant={sortType === "oldest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortType("oldest")}
          >
            最早发布
          </Button>
          <Button
            variant={sortType === "recently-modified" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortType("recently-modified")}
          >
            最近修改
          </Button>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.length > 0 ? currentArticles.map(item => (
          <BlogListCard key={item.id} item={item} allCategories={allCategories} />
        )) : (
          <div className="text-center py-12 col-span-full">
            <p className="text-muted-foreground mb-4">暂无公开文章</p>
            <Link href="/blog/create">
              <Button>创建文章</Button>
            </Link>
          </div>
        )}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {renderPagination()}
          </div>
        </div>
      )}

      {/* 文章计数信息 */}
      <div className="text-center text-sm text-muted-foreground">
        显示 {currentArticles.length} 篇文章，共 {sortedArticles.length} 篇
        {currentPage > 1 && `（第 ${currentPage} 页，共 ${totalPages} 页）`}
      </div>
    </div>
  );
}