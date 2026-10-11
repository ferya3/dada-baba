import Link from "next/link";

export type Brand = { name: string; shortName: string };

export function Logo({ brand, onClick }: { brand: Brand; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group flex items-center gap-3" aria-label={`${brand.name} — صفحه اصلی`}>
      <span className="relative grid size-10 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/30 transition-transform duration-500 group-hover:rotate-45">
        <svg viewBox="0 0 24 24" className="size-5 text-primary" aria-hidden>
          <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-black tracking-tight">{brand.shortName}</span>
        <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase" dir="ltr">
          Holding
        </span>
      </span>
    </Link>
  );
}
