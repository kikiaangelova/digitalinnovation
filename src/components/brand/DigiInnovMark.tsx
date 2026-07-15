import { cn } from "@/lib/utils";

interface DigiInnovMarkProps {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * DigiInnovMark — the DigiInnov Case Lab brand mark.
 * Two concentric arcs meeting at a decision node, forming a stylised "D + i":
 * connection, direction, and the moment of an intentional decision.
 * Inline SVG, respects reduced motion, no continuous animation.
 */
export function DigiInnovMark({ className, size = 32, title = "DigiInnov Case Lab" }: DigiInnovMarkProps) {
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    >
      <title>{title}</title>
      {/* Outer arc — the path */}
      <path
        d="M8 32 A16 16 0 1 1 32 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        className="text-foreground/85"
      />
      {/* Inner arc — the practice loop */}
      <path
        d="M14 28 A10 10 0 0 1 28 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-foreground/40"
      />
      {/* Decision node — the moment of choice */}
      <circle cx="32" cy="8" r="4.5" fill="hsl(var(--brand))" />
      <circle cx="32" cy="8" r="1.6" fill="hsl(var(--paper))" />
    </svg>
  );
}

interface DigiInnovLogoProps {
  className?: string;
  markSize?: number;
  short?: boolean;
}

/** Brand mark + wordmark. Use in headers, auth, footer. */
export function DigiInnovLogo({ className, markSize = 32, short = false }: DigiInnovLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <DigiInnovMark size={markSize} />
      <span className="font-display font-bold tracking-tight leading-none text-foreground">
        {short ? "DigiInnov" : (
          <>
            DigiInnov <span className="text-muted-foreground font-normal">Case Lab</span>
          </>
        )}
      </span>
    </span>
  );
}

export default DigiInnovMark;