'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@radix-ui/react-avatar";
import { GithubIcon } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"

export default function Nav() {
    const { user, signOut } = useAuth()
    const pathname = usePathname()
    console.log(pathname);

    // 添加调试日志
    // console.log("Current user in Nav:", user, user?.user_metadata)

    return (
        <nav className="p-4 md:px-[12rem] fixed top-0 left-0 w-full bg-background dark:bg-gray-900 border-b border-border z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-current font-mono text-lg font-bold text-foreground dark:text-yellow-500">Your Blog</div>
                <div className="hidden lg:flex items-center space-x-2">
                    <Link href="/">
                        <Button variant="ghost" className={cn("cursor-pointer text-current font-mono", acitveNavClassName(pathname, '/'))}>首页</Button>
                    </Link>
                    <Link href="/categories" className="text-current font-mono hover:text-gray-300">
                        <Button variant="ghost" className={cn("cursor-pointer text-current font-mono", acitveNavClassName(pathname, '/categories'))}>分类</Button>
                    </Link>
                    <Link href="/blog/create" className="text-current font-mono hover:text-gray-300">
                        <Button variant="ghost" className={cn("cursor-pointer text-current font-mono", acitveNavClassName(pathname, '/blog/create'))}>创建文章</Button>
                    </Link>
                    {user ?
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                            <AvatarImage
                                src={user.user_metadata.avatar_url || "/placeholder.svg?height=32&width=32"}
                                alt={user.email || ""} />
                            <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="text-left ml-3 mr-3">
                            <div className="text-sm font-medium">{user.user_metadata.user_name}</div>
                            <div className="text-xs">{user.email || ''}</div>
                        </div>

                        <Button variant="outline" className="cursor-pointer" onClick={() => signOut()}>
                            Sign Out
                        </Button>
                    </div>
                     :
                    <Link href="/login">
                        <Button variant="ghost" className="cursor-pointer">
                            <GithubIcon /> Sign in
                        </Button>
                    </Link>}
                    <ThemeSwitcher />
                </div>
            </div>
        </nav>
    );
}


function acitveNavClassName(pathname: string, url: string) {
    if(pathname === url) {
        return 'text-sky-500 font-semibold hover:bg-transparent hover:text-sky-500'
    } else {
        return ''
    }
}