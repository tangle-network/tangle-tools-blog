import { cn } from "@/lib/utils";
import { Info, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react";

type CalloutType = "info" | "warning" | "tip" | "danger";

const calloutConfig: Record<
  CalloutType,
  { icon: React.ElementType; bg: string; border: string; text: string; iconColor: string }
> = {
  info: {
    icon: Info,
    bg: "bg-[color:var(--color-brand-soft)]/55 dark:bg-[color:var(--bg-subtle)]/85",
    border: "border-[color:var(--color-brand)]/35 dark:border-[color:var(--border-strong)]",
    text: "text-[color:var(--text-body)] dark:text-[color:var(--text-body)]",
    iconColor: "text-[color:var(--color-brand)]",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-100/80 dark:bg-amber-950/25",
    border: "border-amber-300 dark:border-amber-900",
    text: "text-amber-950 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-emerald-100/70 dark:bg-emerald-950/25",
    border: "border-emerald-300 dark:border-emerald-900",
    text: "text-emerald-950 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  danger: {
    icon: AlertCircle,
    bg: "bg-red-100/75 dark:bg-red-950/25",
    border: "border-red-300 dark:border-red-900",
    text: "text-red-950 dark:text-red-200",
    iconColor: "text-red-600 dark:text-red-400",
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-7 rounded-xl border p-4 shadow-[var(--shadow-soft)]",
        config.bg,
        config.border
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconColor)} />
        <div className={cn("min-w-0 text-sm leading-relaxed", config.text)}>
          {title && <p className="mb-1 font-semibold">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
