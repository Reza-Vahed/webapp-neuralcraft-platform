import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  /** Reduce vertical rhythm for denser sections (e.g. below a hero). */
  spacing?: "default" | "compact";
};

export function Section({
  className,
  spacing = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacing === "compact" ? "py-12 sm:py-16" : "py-20 sm:py-28",
        className
      )}
      {...props}
    />
  );
}
