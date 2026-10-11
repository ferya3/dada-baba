"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Asks for confirmation, then runs `action`. */
export function DeleteButton({
  action,
  confirmText,
  label = "حذف",
  size = "sm",
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
  size?: "sm" | "icon";
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      disabled={pending}
      aria-label={size === "icon" ? label : undefined}
      className="text-muted-foreground hover:text-destructive"
      onClick={() => {
        if (window.confirm(confirmText)) startTransition(() => action());
      }}
    >
      {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
      {size !== "icon" && label}
    </Button>
  );
}
