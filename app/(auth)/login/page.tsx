'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Github } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGitHubLoading, setIsGitHubLoading] = useState(false);
    const { toast } = useToast();
    const { signInWithGitHub } = useAuth()

    const handleGitHubLogin = async () => {
        setIsGitHubLoading(true)

        try {
            const { error } = await signInWithGitHub()

            if (error) {
                toast({
                title: "GitHub 登录失败",
                description: error.message,
                variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "GitHub 登录失败",
                description: "发生了未知错误，请稍后再试",
                variant: "destructive",
            })
        } finally {
            setIsGitHubLoading(false)
        }
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
    }

    return (
        <div className="container h-screen mx-auto px-4 flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-sky-500">Your Blog 登录</CardTitle>
                    {/* <CardDescription>登录您的账户</CardDescription> */}
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2 items-center">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 cursor-pointer font-bold"
                            onClick={handleGitHubLogin}
                            disabled={isGitHubLoading}
                        >
                            {isGitHubLoading ? (
                            <div className="h-4 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                            <Github className="h-4 w-3 text-neutral-900" />
                            )}
                            使用 GitHub 登录
                        </Button>
                        <div className="text-xs text-stone-400">仅限授权用户使用 GitHub 登录</div>
                    </div>

                    {/* <Separator className="relative flex items-center justify-center my-10">
                        <div className="absolute px-6 bg-white text-base text-stone-600">或</div>
                    </Separator> */}

                    {/* <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-4">
                                    <Label htmlFor="email">电子邮件</Label>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-4">
                                    <Label htmlFor="password">密码</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" className="w-full cursor-pointer bg-sky-600 hover:bg-sky-700" disabled={isLoading}>
                                {isLoading ? "登录中..." : "登录"}
                            </Button>
                        </div>
                    </form> */}


                </CardContent>
            </Card>
        </div>
    )
}