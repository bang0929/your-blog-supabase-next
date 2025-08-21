// components/code-block.tsx
"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  "data-code-content": string;
  "data-language": string;
}

export function CodeBlock({ "data-code-content": encodedContent, "data-language": language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const content = decodeURIComponent(encodedContent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative my-4 rounded-md overflow-hidden group">
      <div className="flex justify-between items-center bg-gray-800 text-gray-200 px-4 py-2 text-xs">
        <span className="uppercase">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-gray-200 hover:bg-gray-700"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3 w-3 mr-1" />
          ) : (
            <Copy className="h-3 w-3 mr-1" />
          )}
          {copied ? "已复制" : "复制"}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={coldarkDark}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 0.375rem 0.375rem",
          padding: "1rem"
        }}
        wrapLongLines={true}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}