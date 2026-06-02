import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

export type Token = { id: string; text: string; color?: string };

type Props = {
  title: string;
  subtitle?: string;
  accent: "js" | "api" | "micro" | "macro" | "network" | "console";
  tokens: Token[];
  icon?: ReactNode;
  className?: string;
  variant?: "stack" | "queue" | "log";
};

const accentVar: Record<Props["accent"], string> = {
  js: "var(--runtime-js)",
  api: "var(--runtime-api)",
  micro: "var(--runtime-micro)",
  macro: "var(--runtime-macro)",
  network: "var(--runtime-network)",
  console: "var(--runtime-console)",
};

export function RuntimeArea({
  title,
  subtitle,
  accent,
  tokens,
  icon,
  className = "",
  variant = "queue",
}: Props) {
  const color = accentVar[accent];

  // Stack renders top-down (last item visually at top), queue left-to-right, log newest at bottom.
  const display =
    variant === "stack" ? [...tokens].reverse() : tokens;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-xl border bg-card/60 p-3 ${className}`}
      style={{ borderColor: `color-mix(in oklab, ${color} 45%, transparent)` }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
          />
          <h3
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color }}
          >
            {title}
          </h3>
        </div>
        {icon}
      </div>
      {subtitle && (
        <p className="mb-2 text-[11px] text-muted-foreground">{subtitle}</p>
      )}

      <div
        className={`relative flex-1 min-h-[90px] rounded-lg bg-background/40 p-2 ${
          variant === "queue" ? "flex items-center gap-2 overflow-x-auto" :
          variant === "stack" ? "flex flex-col-reverse gap-1.5 justify-start" :
          "flex flex-col gap-1 overflow-y-auto"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {display.length === 0 && (
            <motion.span
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="text-[11px] italic text-muted-foreground"
            >
              {variant === "log" ? "// waiting for output…" : "empty"}
            </motion.span>
          )}

          {display.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.7, y: variant === "log" ? 10 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="whitespace-nowrap rounded-md px-2.5 py-1.5 font-mono text-[12px] font-medium"
              style={{
                color: variant === "log" ? color : "white",
                background:
                  variant === "log"
                    ? "transparent"
                    : `color-mix(in oklab, ${t.color ?? color} 30%, transparent)`,
                border:
                  variant === "log"
                    ? "none"
                    : `1px solid ${t.color ?? color}`,
                boxShadow:
                  variant === "log"
                    ? "none"
                    : `0 0 18px -4px ${t.color ?? color}`,
              }}
            >
              {variant === "log" ? <span style={{ color: "var(--runtime-console)" }}>▸ </span> : null}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
