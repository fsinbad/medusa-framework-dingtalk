import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "default" | "success" | "muted";
};

const toneMap = {
  default: "border-white/15 bg-white/8 text-white/88",
  success: "border-emerald-500/20 bg-emerald-500/12 text-emerald-200",
  muted: "border-amber-300/15 bg-amber-200/8 text-amber-50/70",
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.22em] uppercase ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}
