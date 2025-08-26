'use client';

import { useState } from "react"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@radix-ui/react-avatar";
import { GithubIcon, Minimize2 } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, signOut } = useAuth()
    const pathname = usePathname()
    // console.log(pathname);

    // 添加调试日志
    // console.log("Current user in Nav:", user, user?.user_metadata)

    return (
        <nav className="p-4 lg:px-48 fixed top-0 left-0 w-full bg-background dark:bg-gray-900 border-b border-border z-50">
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
                <div className="flex lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer flex flex-col justify-center items-center w-10 h-10 gap-0.5 hover:scale-110"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="block w-6 h-0.5 bg-foreground mb-1"></span>
                        <span className="block w-6 h-0.5 bg-foreground mb-1"></span>
                        <span className="block w-6 h-0.5 bg-foreground"></span>
                    </Button>
                </div>

                {isMenuOpen &&
                    <div className="fixed inset-0 bg-sky-200/95 z-50 flex flex-col items-center justify-center lg:hidden bg-background  dark:bg-slate-700">
                        <Button variant="ghost" size="icon" className="cursor-pointer absolute top-4 right-4 [&_svg]:size-5 [&_svg]:hover:size-6"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Minimize2 strokeWidth={3}/>
                        </Button>
                        <div className="flex flex-col items-center space-y-6">
                            <Link href="/">
                                <Button variant="outline" className="cursor-pointer w-80 h-12 font-semibold text-base bg-orange-100 hover:bg-orange-200 text-black hover:text-black"
                                    onClick={() => setIsMenuOpen(false)}>首页</Button>
                            </Link>
                            <Link href="/categories" className="text-current font-mono">
                                <Button variant="outline" className="cursor-pointer w-80 h-12 font-semibold text-base bg-orange-100 hover:bg-orange-200 text-black hover:text-black"
                                    onClick={() => setIsMenuOpen(false)}>分类</Button>
                            </Link>
                            <Link href="/blog/create" className="text-current font-mono">
                                <Button variant="outline" className="cursor-pointer w-80 h-12 font-semibold text-base bg-orange-100 hover:bg-orange-200 text-black hover:text-black"
                                    onClick={() => setIsMenuOpen(false)}>创建文章</Button>
                            </Link>
                            {user ?
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center mb-8 mt-6">
                                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                            <AvatarImage
                                                src={user.user_metadata.avatar_url || "/placeholder.svg?height=32&width=32"}
                                                alt={user.email || ""} />
                                            <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col ml-4">
                                            <div className="text-base font-medium">{user.user_metadata.user_name}</div>
                                            <div className="text-sm">{user.email || ''}</div>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="cursor-pointer w-80 h-12" onClick={() => signOut()}>
                                        Sign Out
                                    </Button>
                                </div>
                                :
                                <Link href="/login">
                                    <Button variant="ghost" className="cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                                        <GithubIcon /> Sign in
                                    </Button>
                                </Link>}
                            <ThemeSwitcher />
                        </div>
                    </div>
                }
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