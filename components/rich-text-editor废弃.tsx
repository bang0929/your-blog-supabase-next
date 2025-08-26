// components/rich-text-editor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder"

import { createLowlight  } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const lowlight = createLowlight()
// 注册语法高亮语言
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("python", python);
lowlight.register("java", java);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  immediatelyRender?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "开始编写内容...",
  disabled = false,
  immediatelyRender = false
}: RichTextEditorProps) {
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "code-block",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      // 计算字数
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[300px]",
      },
    },
    immediatelyRender, // 加上这一行
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled || !editor.can().chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled || !editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("codeBlock") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={disabled}
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* 编辑器内容 */}
      <EditorContent editor={editor} className={disabled ? "opacity-70" : ""} />

      {/* 状态栏 */}
      <div className="flex justify-between items-center px-4 py-2 border-t bg-gray-50 text-sm text-gray-500">
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 mr-1" />
          {wordCount} 字
        </div>
        <div>
          {editor.isActive("codeBlock") ? "代码块" : "标准编辑"}
        </div>
      </div>
    </div>
  );
}