"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, siteConfig } from "@/lib/site";
import { cn, toFaDigits } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import { getLenis } from "@/components/motion/SmoothScroll";

/** Full-screen mobile menu with staggered links. */
export function Navigation({ isActive }: { isActive: (href: string) => boolean }) {
  const open = useUIStore((s) => s.menuOpen);
  const setOpen = useUIStore((s) => s.setMenuOpen);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="منوی اصلی"
          initial={{ clipPath: "circle(0% at 8% 4%)" }}
          animate={{ clipPath: "circle(150% at 8% 4%)" }}
          exit={{ clipPath: "circle(0% at 8% 4%)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-40 flex flex-col bg-background/95 pt-28 backdrop-blur-xl lg:hidden"
          data-lenis-prevent
        >
          <nav aria-label="ناوبری موبایل" className="container-page flex-1 overflow-y-auto">
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
              className="flex flex-col"
            >
              {mainNav.map((item, i) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } }}
                  className="border-b border-border"
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-baseline gap-4 py-4 text-3xl font-bold transition-colors",
                      isActive(item.href) ? "text-primary" : "hover:text-primary",
                    )}
                  >
                    <span className="text-xs text-muted-foreground">{toFaDigits(String(i + 1).padStart(2, "0"))}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
          <div className="container-page py-6 text-sm text-muted-foreground">
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
              {siteConfig.contact.email}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
