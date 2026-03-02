import { cn } from "@/lib/utils";
import { Info, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react";

type CalloutType = "info" | "warning" | "tip" | "danger";

const calloutConfig: Record<
  CalloutType,
  { icon: React.ElementType; bg: string; border: string; text: string; iconColor: string }
> = {
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-900",
    text: "text-blue-900 dark:text-blue-200",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900",
    text: "text-amber-900 dark:text-amber-200",
    iconColor: "text-amber-500",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900",
    text: "text-emerald-900 dark:text-emerald-200",
    iconColor: "text-emerald-500",
  },
  danger: {
    icon: AlertCircle,
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-900",
    text: "text-red-900 dark:text-red-200",
    iconColor: "text-red-500",
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
        "my-6 rounded-lg border p-4",
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
