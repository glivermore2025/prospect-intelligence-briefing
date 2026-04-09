import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-slate-100 text-slate-800",
      queued: "bg-slate-200 text-slate-800",
      researching: "bg-blue-100 text-blue-800",
      drafted: "bg-violet-100 text-violet-800",
      completed: "bg-emerald-100 text-emerald-800",
      failed: "bg-red-100 text-red-800",
      pending: "bg-amber-100 text-amber-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
