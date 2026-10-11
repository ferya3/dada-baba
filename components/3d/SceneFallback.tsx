import { cn } from "@/lib/utils";

/**
 * Lightweight 2D stand-in for the WebGL scenes: shown while a scene loads, and
 * permanently on devices that get no 3D (no WebGL, reduced motion, data saver).
 */
export function SceneFallback({ color = "#e0b25b", className }: { color?: string; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="animate-float-slow absolute top-1/2 left-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 65%)` }}
      />
      <svg viewBox="0 0 400 400" className="animate-spin-slow absolute top-1/2 left-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 opacity-60">
        <circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeOpacity="0.15" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="white" strokeOpacity="0.08" />
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return <circle key={i} cx={200 + Math.cos(a) * 150} cy={200 + Math.sin(a) * 150} r="7" fill={color} />;
        })}
        <polygon points="200,160 235,180 235,220 200,240 165,220 165,180" fill={color} fillOpacity="0.8" />
      </svg>
    </div>
  );
}
