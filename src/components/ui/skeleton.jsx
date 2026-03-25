
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/10 bg-slate-200 dark:bg-slate-800", className)}
      {...props} />
  );
}

export { Skeleton }
