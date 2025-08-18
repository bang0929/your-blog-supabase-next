'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Nav() {
    return (
        <nav className="p-4 md:px-[12rem] fixed top-0 left-0 w-full bg-background dark:bg-gray-900 border-b border-border z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-current font-mono text-lg font-bold text-foreground dark:text-yellow-500">Your Blog</div>
                <div className="hidden items-center space-x-4 md:flex">
                    <Link href="/">
                        <Button variant="ghost" className="cursor-pointer text-current font-mono">首页</Button>
                    </Link>
                    <Link href="/categories" className="text-current font-mono hover:text-gray-300">
                        <Button variant="ghost" className="cursor-pointer text-current font-mono">分类</Button>
                    </Link>
                    <Link href="/blog/create" className="text-current font-mono hover:text-gray-300">
                        <Button variant="ghost" className="cursor-pointer text-current font-mono">创建文章</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="ghost" className="cursor-pointer">
                            <GithubIcon /> Sign in
                        </Button>
                    </Link>
                    <ThemeSwitcher />
                </div>
            </div>
        </nav>
    );
}