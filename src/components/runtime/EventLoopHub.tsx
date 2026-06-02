import { motion } from "framer-motion";

type Props = { spinning: boolean };

export function EventLoopHub({ spinning }: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center rounded-xl border border-border bg-card/60 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Event Loop
      </div>
      <motion.div
        animate={{ rotate: spinning ? 360 : 0 }}
        transition={{ repeat: spinning ? Infinity : 0, ease: "linear", duration: 4 }}
        className="relative my-3 h-24 w-24"
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="el-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--runtime-js)" />
              <stop offset="50%" stopColor="var(--runtime-micro)" />
              <stop offset="100%" stopColor="var(--runtime-macro)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="38" fill="none" stroke="url(#el-grad)" strokeWidth="3" strokeDasharray="8 6" />
          <circle cx="50" cy="50" r="6" fill="var(--runtime-js)" />
          <circle cx="50" cy="12" r="4" fill="var(--runtime-micro)" />
          <circle cx="88" cy="50" r="4" fill="var(--runtime-macro)" />
          <circle cx="50" cy="88" r="4" fill="var(--runtime-network)" />
          <circle cx="12" cy="50" r="4" fill="var(--runtime-api)" />
        </svg>
      </motion.div>
      <div className="text-center text-[10px] leading-tight text-muted-foreground">
        Drains microtasks<br />before macrotasks
      </div>
    </div>
  );
}
