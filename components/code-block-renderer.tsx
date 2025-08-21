// components/code-block-renderer.tsx
"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CodeBlock } from "@/components/code-block";

export function CodeBlockRenderer() {
  useEffect(() => {
    // 查找所有需要渲染的代码块占位符
    const codeBlockPlaceholders = document.querySelectorAll(
      'div[data-code-content][data-language]'
    );

    codeBlockPlaceholders.forEach((placeholder) => {
      const encodedContent = placeholder.getAttribute("data-code-content");
      const language = placeholder.getAttribute("data-language");

      if (!encodedContent || !language) return;

      // 创建根节点并渲染代码块组件
      const root = createRoot(placeholder);
      root.render(
        <CodeBlock
          data-code-content={encodedContent}
          data-language={language}
        />
      );
    });
  }, []);

  return null;
}