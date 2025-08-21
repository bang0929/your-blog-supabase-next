// components/rich-text-renderer.tsx (更新版)
"use client";

import { useEffect, useRef } from "react";
import { CodeBlockRenderer } from "@/components/code-block-renderer";

interface RichTextRendererProps {
  content: string;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 处理代码块高亮
    const codeBlocks = containerRef.current.querySelectorAll("pre code");
    codeBlocks.forEach((codeBlock) => {
      const preElement = codeBlock.parentElement;
      if (!preElement) return;

      // 提取语言信息
      const language = Array.from(codeBlock.classList)
        .find(cls => cls.startsWith("language-"))
        ?.replace("language-", "") || "text";

      // 创建代码高亮组件占位符
      const codeContent = codeBlock.textContent || "";
      const placeholder = document.createElement("div");
      placeholder.setAttribute("data-code-content", encodeURIComponent(codeContent));
      placeholder.setAttribute("data-language", language);

      if (preElement.parentNode) {
        preElement.parentNode.replaceChild(placeholder, preElement);
      }
    });
  }, [content]);

  return (
    <>
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: content }}
        className="rich-text-content"
      />
      <CodeBlockRenderer />
    </>
  );
}