import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  /** Text in the address bar, e.g. "energy.example.com". */
  address?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** Minimal browser chrome around a site screenshot. */
export function BrowserFrame({ address, className, children }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f16] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4" dir="ltr">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex h-6 min-w-0 max-w-xs flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-md bg-white/[0.06] px-3 text-xs text-muted-foreground">
          <Lock className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{address}</span>
        </span>
        <span className="w-[42px]" aria-hidden />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export function displayHost(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
