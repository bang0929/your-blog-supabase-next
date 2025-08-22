import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,

 } from "@/components/ui/select";

export default function Home() {

  return (
    <div className="container px-4 md:px-48 pt-20 md:pt-24 font-sans min-h-screen gap-16">
      <main className="flex flex-col gap-[32px] row-start-2 sm:items-start">
        <div className="flex gap-4 items-center">
          <Label>排序方式：</Label>
          <Button variant="ghost" className="cursor-pointer">
            最新发布
          </Button>
          <Button variant="ghost" className="cursor-pointer">
            最早发布
          </Button>
          <Button variant="ghost" className="cursor-pointer">
            最近修改
          </Button>
        </div>

        <div className="flex flex-wrap">

        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
