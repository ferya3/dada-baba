"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Logo, type Brand } from "./Logo";
import { Navigation } from "./Navigation";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ brand, email }: { brand: Brand; email: string }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const toggleMenu = useUIStore((s) => s.toggleMenu);

  // Solid background once scrolled; slide away on scroll down, return on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 240 && y > prev && !menuOpen);
  });

  const desktopNav = mainNav.filter((item) => item.href !== "/" && item.href !== "/contact");

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "container-page mt-3 flex h-16 items-center justify-between rounded-2xl border border-transparent transition-[background-color,border-color,backdrop-filter] duration-500",
            (scrolled || menuOpen) && "border-border bg-background/70 backdrop-blur-xl",
          )}
        >
          <Logo brand={brand} />

          <nav aria-label="ناوبری اصلی" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {desktopNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative isolate block rounded-full px-4 py-2 text-sm transition-colors hover:text-foreground",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <MagneticButton className="hidden sm:inline-block">
              <Button asChild size="sm">
                <Link href="/contact">تماس با ما</Link>
              </Button>
            </MagneticButton>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </motion.header>
      <Navigation email={email} isActive={(href) => isActive(pathname, href)} />
    </>
  );
}
