import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SceneFallback } from "@/components/3d/SceneFallback";

export default function NotFound() {
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden">
      <SceneFallback />
      <div className="container-page relative flex flex-col items-center gap-6 text-center">
        <span className="text-8xl font-black text-gradient">۴۰۴</span>
        <h1 className="text-2xl font-bold">صفحه مورد نظر پیدا نشد</h1>
        <p className="text-muted-foreground">ممکن است نشانی تغییر کرده یا صفحه حذف شده باشد.</p>
        <Button asChild>
          <Link href="/">بازگشت به خانه</Link>
        </Button>
      </div>
    </section>
  );
}
