"use client";

import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size={"sm"} aria-hidden="true">
        <div className="w-4 h-4" /> {/* 保持相同尺寸的占位符 */}
      </Button>
    );
  }

  return (
    <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme((theme) => theme === 'dark' ? 'light' : 'dark')}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        {/* <Monitor className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" /> */}
    </Button>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="ghost" size={"sm"}>
    //       {theme === "light" ? (
    //         <Sun
    //           key="light"
    //           size={ICON_SIZE}
    //           className={"text-muted-foreground"}
    //         />
    //       ) : theme === "dark" ? (
    //         <Moon
    //           key="dark"
    //           size={ICON_SIZE}
    //           className={"text-muted-foreground"}
    //         />
    //       ) : (
    //         <Laptop
    //           key="system"
    //           size={ICON_SIZE}
    //           className={"text-muted-foreground"}
    //         />
    //       )}
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className="w-content" align="start">
    //     <DropdownMenuRadioGroup
    //       value={theme}
    //       onValueChange={(e) => setTheme(e)}
    //     >
    //       <DropdownMenuRadioItem className="flex gap-2" value="light">
    //         <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
    //         <span>Light</span>
    //       </DropdownMenuRadioItem>
    //       <DropdownMenuRadioItem className="flex gap-2" value="dark">
    //         <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
    //         <span>Dark</span>
    //       </DropdownMenuRadioItem>
    //       <DropdownMenuRadioItem className="flex gap-2" value="system">
    //         <Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
    //         <span>System</span>
    //       </DropdownMenuRadioItem>
    //     </DropdownMenuRadioGroup>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};

export { ThemeSwitcher };
